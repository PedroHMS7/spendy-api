const transacaoRepository = require('../repositories/transacaoRepository');
const categoriaRepository = require('../repositories/categoriaRepository');

async function criar(dados) {
    const { descricao, valor, tipo, data, categoria_id } = dados;

    if(descricao.trim() === ""){
        throw new Error("Descrição inválida");
    }

    if(valor <= 0){
        throw new Error("Valor deve ser positivo");
    }

    if(!['receita','despesa'].includes(tipo)){
        throw new Error("Tipo inválido");
    }

    const categoria = await categoriaRepository.buscarPorId(categoria_id);

    if(!categoria){
        throw new Error("Categoria não encontrada");
    }

    try {
        return await transacaoRepository.criar(dados);
    }
    catch(error){
        console.error("Erro ao criar transação", error);
        throw error;
    }
}

async function listarTodas() {
    return await transacaoRepository.buscarTodas();
}

module.exports = { criar, listarTodas }
