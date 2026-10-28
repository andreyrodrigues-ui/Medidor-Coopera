const express = require("express");
const { simular } = require("./calculos");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));
app.post("/api/simular", (req, res) => {
    const { aparelhos } = req.body;

    if (!aparelhos || !Array.isArray(aparelhos) || aparelhos.length === 0) {
        return res.status(400).json({
            erro: "A lista de aparelhos não pode estar vazia"
        });
    }

    for(let i = 0; i < aparelhos.length; i++) {
        const item = aparelhos[i];
        const numAparelho = i + 1;

        if (typeof item.nome !== "string" || item.nome.trim() === "") {
            return res.status(400).json({
                erro: `O campo "nome" deve ser um texto válido (aparelho ${numAparelho})`
            });
        }

        if (typeof item.potenciaW !== "number" || isNaN(item.potenciaW) || item.potenciaW < 1 || item.potenciaW > 10000) {
            return res.status(400).json({
                erro: `potenciaW deve ser um número entre 1 e 10000 (aparelho ${numAparelho})`
            });
        }

        if (typeof item.horasDia !== "number" || isNaN(item.horasDia) || item.horasDia < 0 || item.horasDia > 24 ) {
            return res.status(400).json({
                erro: `horasDia deve estar entre 0 e 24 (aparelho ${numAparelho})`
            });
        }

        if (typeof item.diasMes !== "number" || !Number.isInteger(item.diasMes) || item.diasMes < 1 || item.diasMes > 31) {
            return res.status(400).json({
                erro: `diasMes deve ser um número inteiro entre 1 e 31 (aparelho ${numAparelho})`
            });
        }
    }

    try {
        const resultado = simular(aparelhos);
        return res.json(resultado);
    } catch (err) {
        return res.status(500).json({
            erro: "Erro interno ao processar os cálculos"
        });
    }
});

app.listen(PORT, () => {
    console.log("Medidor Coopera rodando em http://localhost:${PORT}");
});