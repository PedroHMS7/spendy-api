import { Request, Response, NextFunction } from 'express';
import { ErroApp } from '../utils/erros';

// O Express só reconhece um middleware de erro se ele tiver os 4 parâmetros,
// mesmo que req e next não sejam usados.
function tratarErros(error: unknown, req: Request, res: Response, next: NextFunction) {
    if (error instanceof ErroApp) {
        return res.status(error.status).json({ erro: error.message });
    }

    if (error instanceof SyntaxError) {
        return res.status(400).json({ erro: "JSON inválido" });
    }

    console.error("Erro inesperado", error);
    return res.status(500).json({ erro: "Erro interno do servidor" });
}

export = tratarErros;
