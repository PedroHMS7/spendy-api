const categoriaRepository = require('../repositories/categoriaRepository');

async function listarTodas(usuario_id) {
    return await categoriaRepository.buscarTodas(usuario_id);
}

function validarCategoria(nome,tipo){
    if(nome.trim() === "") {
        throw new Error("Nome inválido");
    }

    if(!['receita','despesa'].includes(tipo)) {
        throw new Error("Tipo inválido");
    }
}

async function criar(dados,usuario_id) {
    const {nome,tipo} = dados;

    validarCategoria(nome,tipo);

    try {
        const categoriaCriada = await categoriaRepository.criar(nome,tipo,usuario_id);
        return categoriaCriada;
    }
    catch(error) {
        console.error("Erro ao criar categoria", error);
        throw error;
    }
}

async function atualizar(id,dados,usuario_id) {
    const { nome, tipo } = dados;

    validarCategoria(nome,tipo);

    try {
        const categoriaAtualizada = await categoriaRepository.atualizar(id,dados,usuario_id);

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

async function excluir(id,usuario_id) {
    try {
        const categoriaExcluida = await categoriaRepository.excluir(id,usuario_id);
        
        if(categoriaExcluida === null){
            throw new Error("Categoria não encontrada");
        }

        return categoriaExcluida;
    }
    catch(error){
        console.error("Erro ao excluir categoria", error);
        throw error;
    }
}

module.exports = {listarTodas,criar,atualizar,excluir};