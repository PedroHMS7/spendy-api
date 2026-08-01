const transacaoService = require('../services/transacaoService');

async function repassaTodos(req,res) {
    try {
        const transacoes = await transacaoService.listarTodas();
        return res.status(200).json(transacoes);
    }
    catch(error) {
        console.error("Erro ao buscar transação", error);
            
        return res.status(500).json({ erro: "Erro ao buscar transações"});
    }

}

async function criar(req,res) {
    const dados = req.body;

    try {
        const transacoes = await transacaoService.criar(dados);
        return res.status(201).json(transacoes); 
    }
    catch(error) {
        console.error("Erro ao criar transação", error);
        return res.status(400).json({ erro: error.message });
    }
}

module.exports = { repassaTodos,criar }