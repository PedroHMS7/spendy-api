/// <reference path="../types/express.d.ts" />
import categoriaService = require('../services/categoriaService');
import { Request, Response, NextFunction } from 'express'
import errorMessage = require('../utils/erro');

async function repassaTodos(req : Request, res : Response) {
    const usuario_id = (req.usuario as { id: number }).id;

    try { 
        const categorias = await categoriaService.listarTodas(usuario_id);
        return res.status(200).json(categorias);
    }
    catch(err) {
        console.error("Erro ao buscar categorias", err);
        return res.status(500).json({ erro: "Erro ao buscar categorias"});
    }
}

async function criar(req : Request, res : Response) {
    const dados = req.body;
    const usuario_id = (req.usuario as { id: number }).id;

    try {
        const resultado = await categoriaService.criar(dados,usuario_id);
        return res.status(201).json(resultado);
    }
    catch(error) {
        console.error("Erro ao criar categoria", error)
        return res.status(400).json({ erro: errorMessage(error) });
    }
}

async function atualizar(req : Request, res : Response) {
    const dados = req.body;
    const id = Number(req.params.id);
    const usuario_id = (req.usuario as { id: number }).id;

    try {
        const categoriaAtualizada = await categoriaService.atualizar(id,dados,usuario_id);
        return res.status(200).json(categoriaAtualizada);
    }
    catch(error) {
        console.error("Erro ao atualizar categoria");
        
        if(errorMessage(error) === "Categoria não encontrada"){
            return res.status(404).json({ erro: errorMessage(error)});
        }

        return res.status(400).json({ erro: errorMessage(error) });
    }
}

async function excluir(req : Request, res : Response) {
    const id = Number(req.params.id);
    const usuario_id = (req.usuario as { id: number }).id;

    try {
        await categoriaService.excluir(id,usuario_id);
        return res.status(204).send();
    }
    catch(error) {
        console.error("Erro ao excluir categoria", error);

        if(errorMessage(error)=== "Categoria não encontrada"){
            return res.status(404).json({ erro: errorMessage(error)});
        }

        return res.status(400).json({ erro: errorMessage(error)});
    }
}

export = {repassaTodos,criar,atualizar,excluir};