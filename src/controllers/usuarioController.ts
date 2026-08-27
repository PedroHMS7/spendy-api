import usuarioService = require('../services/usuarioService');
import { Request, Response, NextFunction } from 'express'
import errorMessage = require('../utils/erro');

async function registrar(req : Request, res : Response) {
    const { nome, email, senha } = req.body;

    try {
        const novoUsuario = await usuarioService.registrar(nome, email, senha);
        return res.status(201).json(novoUsuario);
    }
    catch(error) {
        console.error("Erro ao registrar usuário", error);

        if(errorMessage(error) === "Email já cadastrado"){
            return res.status(409).json({ erro: errorMessage(error)});
        }

        return res.status(400).json({ erro: errorMessage(error) });
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
        return res.status(400).json({ erro: errorMessage(error) });
    }
}

export = { registrar, login }