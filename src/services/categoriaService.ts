import categoriaRepository = require('../repositories/categoriaRepository');

async function listarTodas(usuario_id : number) {
    return await categoriaRepository.buscarTodas(usuario_id);
}

function validarCategoria(nome : string, tipo : string){
    if(nome.trim() === "") {
        throw new Error("Nome inválido");
    }

    if(!['receita','despesa'].includes(tipo)) {
        throw new Error("Tipo inválido");
    }
}

async function criar(dados : {nome : string, tipo : string}, usuario_id : number) {
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

async function atualizar(id : number, dados : {nome : string, tipo : string}, usuario_id : number) {
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

async function excluir(id : number, usuario_id : number) {
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

export = {listarTodas,criar,atualizar,excluir};