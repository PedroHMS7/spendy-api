/// <reference path="../types/express.d.ts" />
import categoriaService = require('../services/categoriaService');
import { Request, Response } from 'express'

async function repassaTodos(req : Request, res : Response) {
    const usuario_id = (req.usuario as { id: number }).id;

    const categorias = await categoriaService.listarTodas(usuario_id);
    return res.status(200).json(categorias);
}

async function criar(req : Request, res : Response) {
    const dados = req.body || {};
    const usuario_id = (req.usuario as { id: number }).id;

    const resultado = await categoriaService.criar(dados,usuario_id);
    return res.status(201).json(resultado);
}

async function atualizar(req : Request, res : Response) {
    const dados = req.body || {};
    const id = Number(req.params.id);
    const usuario_id = (req.usuario as { id: number }).id;

    const categoriaAtualizada = await categoriaService.atualizar(id,dados,usuario_id);
    return res.status(200).json(categoriaAtualizada);
}

async function excluir(req : Request, res : Response) {
    const id = Number(req.params.id);
    const usuario_id = (req.usuario as { id: number }).id;

    await categoriaService.excluir(id,usuario_id);
    return res.status(204).send();
}

export = {repassaTodos,criar,atualizar,excluir};
