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

module.exports = {repassaTodos};