import categoriaRepository = require('../repositories/categoriaRepository');
import transacaoRepository = require('../repositories/transacaoRepository');
import { ErroValidacao, ErroNaoEncontrado, ErroConflito } from '../utils/erros';

async function listarTodas(usuario_id : number) {
    return await categoriaRepository.buscarTodas(usuario_id);
}

function validarCategoria(nome : string, tipo : string){
    if(typeof nome !== 'string' || nome.trim() === "") {
        throw new ErroValidacao("Nome inválido");
    }

    if(!['receita','despesa'].includes(tipo)) {
        throw new ErroValidacao("Tipo inválido");
    }
}

async function criar(dados : {nome : string, tipo : string}, usuario_id : number) {
    const {nome,tipo} = dados;

    validarCategoria(nome,tipo);

    return await categoriaRepository.criar(nome,tipo,usuario_id);
}

async function atualizar(id : number, dados : {nome : string, tipo : string}, usuario_id : number) {
    const { nome, tipo } = dados;

    validarCategoria(nome,tipo);

    const categoriaAtualizada = await categoriaRepository.atualizar(id,dados,usuario_id);

    if(categoriaAtualizada === null){
        throw new ErroNaoEncontrado("Categoria não encontrada");
    }

    return categoriaAtualizada;
}

async function excluir(id : number, usuario_id : number) {
    const totalTransacoes = await transacaoRepository.contarPorCategoria(id,usuario_id);

    if(totalTransacoes > 0){
        throw new ErroConflito("Categoria possui transações vinculadas");
    }

    const categoriaExcluida = await categoriaRepository.excluir(id,usuario_id);

    if(categoriaExcluida === null){
        throw new ErroNaoEncontrado("Categoria não encontrada");
    }

    return categoriaExcluida;
}

export = {listarTodas,criar,atualizar,excluir,validarCategoria};
