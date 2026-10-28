const express = require("express");
const { simular } = require("./calculos");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));
app.post("/api/simular", (req, res) => {
    const { aparelhos } = req.body;

    if (!aparelhos || !Array.isArray(aparelhos) || aparelhos.length === 0) {
        return res.status(400).json
    }
})