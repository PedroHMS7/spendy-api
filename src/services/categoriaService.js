const categoriaRepository = require('../repositories/categoriaRepository');

async function listarTodas() {
    return await categoriaRepository.buscarTodas();
}

async function criar(dados){
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

module.exports = {listarTodas,criar};