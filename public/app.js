const aparelhos = []

const form = document.querySelector("#form-aparelho");
const inputNome = document.querySelector("#nome");
const inputPotencia = document.querySelector("#potenciaW");
const inputHoras = document.querySelector("#horasDia");
const inputDias = document.querySelector("#diasMes");

const listaAparelhos = document.querySelector("#lista-aparelhos");
const contadorAparelhos = document.querySelector("#contador-aparelhos");
const btnSimular = document.querySelector("#btn-simular");

const mensagemErro = document.querySelector("#mensagem-erro");
const mensagemStatus = document.querySelector("#mensagem-status");

const resultadoVazio = document.querySelector("#resultado-vazio");
const painelResultado = document.querySelector("#resultado");

const TotalMes = document.querySelector("#total-mes");
const ConsumoTotal = document.querySelector("#consumo-total");
const paineis = document.querySelector("#paineis-necessarios");
const aparelhoMaisCaro = document.querySelector("#aparelho-mais-caro");
const custoMaisCaro = document.querySelector("#custo-mais-caro");
const tabelaDetalhes = document.querySelector("#tabela-detalhes");

function formatarMoeda(valor) {
  return (valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function atualizarListaDOM() {
  listaAparelhos.textContent = " ";
  contadorAparelhos.textContent = aparelhos.length;

  if (aparelhos.length === 0) {
    const liVazia = document.createElement("li");
    liVazia.className = "empty-state";
    liVazia.textContent = "Nenhum aparelho adicionado ainda";
    listaAparelhos.appendChild(liVazia);
    return;
  }

  aparelhos.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "appliance-item";

    const infoDiv = document.createElement("div");
    infoDiv.className = "appliance-info";

    const strongName = document.createElement("strong");
    strongName.textContent = item.nome;

    const spanMeta = document.createElement("span");
    spanMeta.textContent = `${item.potenciaW}W · ${item.horasDia}h/dia · ${item.diasMes} dias/mês`;

    infoDiv.appendChild(strongName);
    infoDiv.appendChild(spanMeta);

    const btnRemover = document.createElement("button");
    btnRemover.type = "button";
    btnRemover.className = "button-remove";
    btnRemover.textContent = "Remover";
    btnRemover.addEventListener("click", () => removerAparelho(index));

    li.appendChild(infoDiv);
    li.appendChild(btnRemover);
    listaAparelhos.appendChild(li);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const novoAparelho = {
    nome: inputNome.value.trim(),
    potenciaW: parseFloat(inputPotencia.value),
    horasDia: parseFloat(inputHoras.value),
    diasMes: parseInt(inputDias.value, 10)
  };

  aparelhos.push(novoAparelho);
  atualizarListaDOM();

  form.reset();
  inputDias.value = 30;
  inputNome.focus();

  mensagemErro.hidden = true;
  mensagemStatus.textContent = '';
});

function removerAparelho(index) {
  aparelhos.splice(index, 1);
  atualizarListaDOM();
  mensagemErro.hidden = true;
  mensagemStatus.textContent = '';
}

btnSimular.addEventListener('click', async () => {
  mensagemErro.hidden = true;
  mensagemStatus.textContent = 'Processando simulação...';

  if(aparelhos.length === 0) {
    mensagemErro.textContent = 'Adicione ao menos um aparelho antes de simular.';
    mensagemErro.hidden = false;
    mensagemStatus.textContent = '';
    return;
  }

  try {
    const response = await fetch('/api/simular', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ aparelhos })
    });

    const dados = await response.json();

    if (!response.ok) {
      mensagemErro.textContent = dados.erro || 'Erro ao calcular a simulação.';
      mensagemErro.hidden = false;
      mensagemStatus.textContent = '';
      return;
    }

    renderizarResultados(dados);
    mensagemStatus.textContent = '';
  } catch (err) {
    mensagemErro.textContent = 'Falha na comunicação com o servidor.';
    mensagemErro.hidden = false;
    mensagemStatus.textContent = '';
  }
});