/// <reference path="../types/express.d.ts" />
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken';


function autenticar(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({erro: "Token não fornecido"})
    } 

    const [, token] = authHeader.split(' ');
    
    try {
        const dados = jwt.verify(token, process.env.JWT_SECRET)
        req.usuario = dados;
        return next();
    }   
    catch(error) {
        console.error("Erro ao validar token", error);
        return res.status(401).json({ erro: "Token inválido" });
    }
}

module.exports = autenticar;