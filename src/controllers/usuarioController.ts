import usuarioService = require('../services/usuarioService');
import { Request, Response } from 'express'

async function registrar(req : Request, res : Response) {
    const { nome, email, senha } = req.body || {};

    const novoUsuario = await usuarioService.registrar(nome, email, senha);
    return res.status(201).json(novoUsuario);
}

async function login(req : Request, res : Response) {
    const { email, senha } = req.body || {};

    const token = await usuarioService.login(email, senha);
    return res.status(200).json({ token });
}

export = { registrar, login }
