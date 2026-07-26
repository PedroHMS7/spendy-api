const categoriaRepository = require('../repositories/categoriaRepository');

async function listarTodas() {
    return await categoriaRepository.buscarTodas();
}

async function criar(dados) {
    const {nome,tipo} = dados;

    if(nome.trim() === "") {
        throw new Error("Nome inválido");
    }

    if(!['receita','despesa'].includes(tipo)) {
        throw new Error("Tipo inválido");
    }

    try {
        const categoriaCriada = await categoriaRepository.criar(nome,tipo);
        return categoriaCriada;
    }
    catch(error) {
        console.error("Erro ao criar categoria", error);
        throw error;
    }
}

async function atualizar(id,dados) {
    const { nome, tipo } = dados;

    if(nome.trim() === "") {
        throw new Error("Nome inválido");
    }

    if(!['receita','despesa'].includes(tipo)) {
        throw new Error("Tipo inválido");
    }

    try {
        const categoriaAtualizada = await categoriaRepository.atualizar(id,dados);

        if(categoriaAtualizada === null){
            throw new Error("Categoria não encontrada");
        }

        return categoriaAtualizada;
    }
    catch(error){
        console.error("Erro ao atualizar", error)
        throw error;
    }
}

module.exports = {listarTodas,criar,atualizar};