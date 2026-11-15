/// <reference path="../types/express.d.ts" />
import transacaoService = require('../services/transacaoService');
import { Request, Response } from 'express'

async function repassaTodos(req : Request, res : Response) {
    const filtros : { tipo?: string, categoria_id?: number } = req.query;
    const { page , limit } = req.query;
    const usuario_id = (req.usuario as { id: number }).id;

    const paginaAtual = Number(page) || 1;
    const limitePorPagina = Number(limit) || 10;

    const transacoes = await transacaoService.listarTodas(filtros, paginaAtual, limitePorPagina, usuario_id);
    return res.status(200).json(transacoes);
}

async function criar(req : Request, res : Response) {
    const dados = req.body || {};
    const usuario_id = (req.usuario as { id: number }).id;

    const transacao = await transacaoService.criar(dados,usuario_id);
    return res.status(201).json(transacao);
}

async function atualizar(req : Request, res : Response) {
    const dados = req.body || {};
    const id = Number(req.params.id);
    const usuario_id = (req.usuario as { id: number }).id;

    const transacaoAtualizada = await transacaoService.atualizar(id,dados,usuario_id);
    return res.status(200).json(transacaoAtualizada);
}

async function excluir(req : Request, res : Response) {
    const id = Number(req.params.id);
    const usuario_id = (req.usuario as { id: number }).id;

    await transacaoService.excluir(id,usuario_id);
    return res.status(204).send();
}

async function resumo(req: Request, res: Response) {
    const { mes, ano } = req.query;
    const usuario_id = (req.usuario as { id: number }).id;

    const hoje = new Date();
    const mesAtual = Number(mes) || (hoje.getMonth() + 1);
    const anoAtual = Number(ano) || hoje.getFullYear();

    const resultado = await transacaoService.resumoMensal(mesAtual, anoAtual, usuario_id);
    return res.status(200).json(resultado);
}

export = { repassaTodos, criar, atualizar, excluir, resumo }
