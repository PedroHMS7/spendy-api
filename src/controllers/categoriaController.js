const categoriaService = require('../services/categoriaService');

async function repassaTodos(req,res) {
    try { 
        const categorias = await categoriaService.listarTodas();
        return res.status(200).json(categorias);
    }
    catch(err) {
        console.error("Erro ao buscar categorias", err);
        return res.status(500).json({ erro: "Erro ao buscar categorias"});
    }
}

async function criar(req,res) {
    const dados = req.body;

    try {
        const resultado = await categoriaService.criar(dados);
        return res.status(201).json(resultado);
    }
    catch(error) {
        console.error("Erro ao criar categoria", error)
        return res.status(400).json({ erro: error.message });
    }
}

async function atualizar(req,res) {
    const dados = req.body;
    const id = Number(req.params.id);

    try {
        const categoriaAtualizada = await categoriaService.atualizar(id,dados);
        return res.status(200).json(categoriaAtualizada);
    }
    catch(error) {
        console.error("Erro ao atualizar categoria");
        
        if(error.message === "Categoria não encontrada"){
            return res.status(404).json({ erro: error.message});
        }

        return res.status(400).json({ erro: error.message });
    }
}

async function excluir(req,res) {
    const id = Number(req.params.id);

    try {
        await categoriaService.excluir(id);
        return res.status(204).send();
    }
    catch(error) {
        console.error("Erro ao excluir categoria", error);

        if(error.message === "Categoria não encontrada"){
            return res.status(404).json({ erro: error.message});
        }

        return res.status(400).json({ erro: error.message});
    }
}

module.exports = {repassaTodos,criar,atualizar,excluir};