const config = require('./config');

const arredondar = (valor) => Math.round(valor * 100) / 100;

function consumoMensalKwh(aparelho) {
    
    return (aparelho.potenciaW * aparelho.horasDia * aparelho.diasMes) / 1000;
}

function custoEnergia(kwh) {
   
    return kwh * config.TARIFA_KWH;
}

function adicionalBandeira(kwh) {

    const valorBandeira = config.VALORES_BANDEIRA[config.BANDEIRA] || 0;
    return (kwh / 100) * valorBandeira;
}

function paineisNecessarios(kwh) {
    if (kwh <= 0) return 0;
    
    const geracaoPorPainel = (config.POTENCIA_PAINEL_W / 1000) * config.HSP * 30 * config.EFICIENCIA;
    return Math.ceil(kwh / geracaoPorPainel);
}

function simular(aparelhos) {
    let consumoTotalKwh = 0;
    let aparelhoMaisCaro = null;
    let maiorCustoAparelho = -1;

    const detalhesBrutos = aparelhos.map((aparelho) => {
        const kwhMes = consumoMensalKwh(aparelho);
        const custo = custoEnergia(kwhMes);

        consumoTotalKwh += kwhMes;

        if (custo > maiorCustoAparelho) {
            maiorCustoAparelho = custo;
            aparelhoMaisCaro = {
                nome: aparelho.nome,
                custo: custo
            };
        }

        return {
            nome: aparelho.nome,
            kwhMes,
            custo
        };
    });

    const custoTotalEnergia = custoEnergia(consumoTotalKwh);
    const adicional = adicionalBandeira(consumoTotalKwh);
    const totalMes = custoTotalEnergia + adicional;
    const paineis = paineisNecessarios(consumoTotalKwh);

    const detalhes = detalhesBrutos.map((item) => {
        const percentual = consumoTotalKwh > 0 ? (item.kwhMes / consumoTotalKwh) * 100 : 0;
        return {
            nome: item.nome,
            kwhMes: arredondar(item.kwhMes), // Corrigido: KwhMes -> kwhMes
            custo: arredondar(item.custo),
            percentual: arredondar(percentual)
        };
    });

    return {
        consumoKwhMes: arredondar(consumoTotalKwh),
        custoEnergia: arredondar(custoTotalEnergia),
        adicionalBandeira: arredondar(adicional),
        totalMes: arredondar(totalMes),
        paineisNecessarios: paineis,
        aparelhoMaisCaro: aparelhoMaisCaro
            ? {
                nome: aparelhoMaisCaro.nome,
                custo: arredondar(aparelhoMaisCaro.custo)
              }
            : null,
        detalhes
    };
}

module.exports = {
    consumoMensalKwh,
    custoEnergia,
    adicionalBandeira,
    paineisNecessarios,
    simular
};