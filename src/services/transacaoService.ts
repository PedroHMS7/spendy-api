import transacaoRepository = require('../repositories/transacaoRepository');
import categoriaRepository = require('../repositories/categoriaRepository');

async function validarTransacao(descricao : string, valor : number, tipo : string, categoria_id : number, usuario_id : number) {
    if(descricao.trim() === ""){
        throw new Error("Descrição inválida");
    }

    if(valor <= 0){
        throw new Error("Valor deve ser positivo");
    }

    if(!['receita','despesa'].includes(tipo)){
        throw new Error("Tipo inválido");
    }

    const categoria = await categoriaRepository.buscarPorId(categoria_id, usuario_id);

    if(!categoria){
        throw new Error("Categoria não encontrada");
    }
}

async function criar(dados : { descricao : string, valor : number, tipo : string, data : string, categoria_id : number}, usuario_id : number) {
    const { descricao, valor, tipo, data, categoria_id } = dados;

   await validarTransacao(descricao, valor, tipo, categoria_id, usuario_id);

    try {
        return await transacaoRepository.criar(dados, usuario_id);
    }
    catch(error){
        console.error("Erro ao criar transação", error);
        throw error;
    }
}

async function listarTodas(filtros : { tipo?: string, categoria_id?: number }, page : number, limit : number, usuario_id : number) {
    return await transacaoRepository.buscarTodas(filtros,page,limit,usuario_id);
}

async function atualizar(id : number, dados : { descricao : string, valor : number, tipo : string, data : string, categoria_id : number}, usuario_id : number) {
    const { descricao, valor, tipo, data, categoria_id} = dados;

    await validarTransacao(descricao, valor, tipo, categoria_id, usuario_id);

    try {
        const transacaoAtualizada = await transacaoRepository.atualizar(id,dados,usuario_id);
        
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

async function excluir(id : number, usuario_id : number) {
    try {
        const transacaoExcluida = await transacaoRepository.excluir(id, usuario_id); 

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

export = { criar, listarTodas, atualizar, excluir }
