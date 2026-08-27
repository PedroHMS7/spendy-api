/// <reference path="../types/express.d.ts" />
import transacaoService = require('../services/transacaoService');
import { Request, Response, NextFunction } from 'express'
import errorMessage = require('../utils/erro');

async function repassaTodos(req : Request, res : Response) {
    const filtros : { tipo?: string, categoria_id?: number } = req.query;
    const { page , limit } = req.query;
    const usuario_id = (req.usuario as { id: number }).id;

    const paginaAtual = Number(page) || 1;
    const limitePorPagina = Number(limit) || 10;
    
    try {
        const transacoes = await transacaoService.listarTodas(filtros, paginaAtual, limitePorPagina, usuario_id);
        return res.status(200).json(transacoes);
    }
    catch(error) {
        console.error("Erro ao buscar transação", error);
        return res.status(500).json({ erro: "Erro ao buscar transações"});
    }
}

async function criar(req : Request, res : Response) {
    const dados = req.body;
    const usuario_id = (req.usuario as { id: number }).id;

    try {
        const transacoes = await transacaoService.criar(dados,usuario_id);
        return res.status(201).json(transacoes); 
    }
    catch(error) {
        console.error("Erro ao criar transação", error);
        return res.status(400).json({ erro: errorMessage(error) });
    }
}

async function atualizar(req : Request, res : Response) {
    const dados = req.body;
    const id = Number(req.params.id);
    const usuario_id = (req.usuario as { id: number }).id;

    try {
        const transacaoAtualizada = await transacaoService.atualizar(id,dados,usuario_id);
        return res.status(200).json(transacaoAtualizada);
    }
    catch(error) {
        console.error("Erro ao atualizar transação", error);
        
        if(errorMessage(error) === "Transação não encontrada"){
            return res.status(404).json({ erro: errorMessage(error) });
        }

        return res.status(400).json({ erro: errorMessage(error) });
    }
}

async function excluir(req : Request, res : Response) {
    const id = Number(req.params.id);
    const usuario_id = (req.usuario as { id: number }).id;

    try {
        const transacaoExcluida = await transacaoService.excluir(id,usuario_id);
        return res.status(204).send();
    }
    catch(error) {
        console.error("Erro ao excluir transação", error);
        
        if(errorMessage(error) === "Transação não encontrada"){
            return res.status(404).json({ erro: errorMessage(error) });
        }

        return res.status(400).json({ erro: errorMessage(error) });
    }
}

export = { repassaTodos, criar, atualizar, excluir }