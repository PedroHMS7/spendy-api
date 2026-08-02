const transacaoRepository = require('../repositories/transacaoRepository');
const categoriaRepository = require('../repositories/categoriaRepository');

async function validarTransacao(descricao, valor, tipo, categoria_id) {
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
}

async function criar(dados) {
    const { descricao, valor, tipo, data, categoria_id } = dados;

   await validarTransacao(descricao, valor, tipo, categoria_id);

    try {
        return await transacaoRepository.criar(dados);
    }
    catch(error){
        console.error("Erro ao criar transação", error);
        throw error;
    }
}

async function listarTodas(filtros, page, limit) {
    return await transacaoRepository.buscarTodas(filtros,page,limit);
}

async function atualizar(id,dados) {
    const { descricao, valor, tipo, data, categoria_id} = dados;

    await validarTransacao(descricao, valor, tipo, categoria_id);

    try {
        const transacaoAtualizada = await transacaoRepository.atualizar(id,dados);
        
        if(transacaoAtualizada === null){
            throw new Error("Transação não encontrada");
        }

        return transacaoAtualizada;
    }
    catch(error) {
        console.error("Erro ao atualziar transação", error);
        throw error;
    }
}

async function excluir(id) {
    try {
        const transacaoExcluida = await transacaoRepository.excluir(id); 

        if(!transacaoExcluida) {
            throw new Error("Transação não encontrada");
        }

        return transacaoExcluida; 
    }
    catch(error) {
        console.error("Erro ao excluir transação", error);
        throw error;
    }
} 

module.exports = { criar, listarTodas, atualizar, excluir }
