import transacaoRepository = require('../repositories/transacaoRepository');
import categoriaRepository = require('../repositories/categoriaRepository');
import { agruparPorCategoria } from './resumoService';
import { ErroValidacao, ErroNaoEncontrado } from '../utils/erros';

async function validarTransacao(descricao : string, valor : number, tipo : string, data : string, categoria_id : number, usuario_id : number) {
    if(typeof descricao !== 'string' || descricao.trim() === ""){
        throw new ErroValidacao("Descrição inválida");
    }

    if(typeof valor !== 'number'){
        throw new ErroValidacao("Valor deve ser um número");
    }

    if(valor <= 0){
        throw new ErroValidacao("Valor deve ser positivo");
    }

    if(!['receita','despesa'].includes(tipo)){
        throw new ErroValidacao("Tipo inválido");
    }

    if(typeof data !== 'string' || isNaN(Date.parse(data))){
        throw new ErroValidacao("Data inválida");
    }

    const categoria = await categoriaRepository.buscarPorId(categoria_id, usuario_id);

    if(!categoria){
        throw new ErroValidacao("Categoria não encontrada");
    }
}

async function criar(dados : { descricao : string, valor : number, tipo : string, data : string, categoria_id : number}, usuario_id : number) {
    const { descricao, valor, tipo, data, categoria_id } = dados;

    await validarTransacao(descricao, valor, tipo, data, categoria_id, usuario_id);

    return await transacaoRepository.criar(dados, usuario_id);
}

async function listarTodas(filtros : { tipo?: string, categoria_id?: number }, page : number, limit : number, usuario_id : number) {
    if(!Number.isInteger(page) || page < 1){
        throw new ErroValidacao("Página inválida");
    }

    if(!Number.isInteger(limit) || limit < 1 || limit > 100){
        throw new ErroValidacao("Limite deve estar entre 1 e 100");
    }

    const { transacoes, total } = await transacaoRepository.buscarTodas(filtros,page,limit,usuario_id);

    return {
        transacoes,
        total,
        pagina: page,
        limite: limit,
        totalPaginas: Math.ceil(total / limit)
    };
}

async function atualizar(id : number, dados : { descricao : string, valor : number, tipo : string, data : string, categoria_id : number}, usuario_id : number) {
    const { descricao, valor, tipo, data, categoria_id} = dados;

    await validarTransacao(descricao, valor, tipo, data, categoria_id, usuario_id);

    const transacaoAtualizada = await transacaoRepository.atualizar(id,dados,usuario_id);

    if(transacaoAtualizada === null){
        throw new ErroNaoEncontrado("Transação não encontrada");
    }

    return transacaoAtualizada;
}

async function excluir(id : number, usuario_id : number) {
    const transacaoExcluida = await transacaoRepository.excluir(id, usuario_id);

    if(!transacaoExcluida) {
        throw new ErroNaoEncontrado("Transação não encontrada");
    }

    return transacaoExcluida;
}

async function resumoMensal(mes: number, ano: number, usuario_id: number) {
    if(!Number.isInteger(mes) || mes < 1 || mes > 12){
        throw new ErroValidacao("Mês inválido");
    }

    if(!Number.isInteger(ano) || ano < 1000 || ano > 9999){
        throw new ErroValidacao("Ano inválido");
    }

    const transacoes = await transacaoRepository.buscarPorMes(mes, ano, usuario_id);
    return agruparPorCategoria(transacoes);
}

export = { criar, listarTodas, atualizar, excluir, validarTransacao, resumoMensal }
