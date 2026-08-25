import usuarioService = require('../services/usuarioService');
import { Request, Response, NextFunction } from 'express'

async function registrar(req : Request, res : Response) {
    const { nome, email, senha } = req.body;

    try {
        const novoUsuario = await usuarioService.registrar(nome, email, senha);
        return res.status(201).json(novoUsuario);
    }
    catch(error) {
        console.error("Erro ao registrar usuário", error);

        if(error.message === "Email já cadastrado"){
            return res.status(409).json({ erro: error.message});
        }

        return res.status(400).json({ erro: error.message });
    }
}

async function login(req : Request, res : Response) {
    const { email, senha } = req.body;

    try {
        const token = await usuarioService.login(email, senha);
        return res.status(200).json({ token });
    }
    catch(error) {
        console.error("Erro ao logar", error);
        return res.status(400).json({ erro: error.message });
    }
}

export = { registrar, login }