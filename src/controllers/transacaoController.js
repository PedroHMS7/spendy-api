const transacaoService = require('../services/transacaoService');

async function repassaTodos(req,res) {
    const filtros = req.query;
    const { page, limit } = req.query;

    const paginaAtual = Number(page) || 1;
    const limitePorPagina = Number(limit) || 10;
    
    try {
        const transacoes = await transacaoService.listarTodas(filtros, paginaAtual, limitePorPagina);
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

async function atualizar(req,res) {
    const dados = req.body;
    const id = Number(req.params.id);

    try {
        const transacaoAtualizada = await transacaoService.atualizar(id,dados);
        return res.status(200).json(transacaoAtualizada);
    }
    catch(error) {
        console.error("Erro ao atualizar transação", error);
        
        if(error.message === "Transação não encontrada"){
            return res.status(404).json({ erro: error.message });
        }

        return res.status(400).json({ erro: error.message });
    }
}

async function excluir(req,res) {
    const id = Number(req.params.id);

    try {
        const transacaoExcluida = await transacaoService.excluir(id);
        return res.status(204).json(transacaoExcluida);
    }
    catch(error) {
        console.error("Erro ao excluir transação", error);
        
        if(error.message === "Transação não encontrada"){
            return res.status(404).json({ erro: error.message });
        }

        return res.status(400).json({ erro: error.message });
    }
}

module.exports = { repassaTodos, criar, atualizar, excluir }