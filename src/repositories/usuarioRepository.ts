import pool = require('../config/database');
import { ResultSetHeader, RowDataPacket } from 'mysql2';

async function criar(nome : string, email : string, senhaHash : string) {
    try {
        const [resultado] = await pool.query<ResultSetHeader>('INSERT INTO usuarios (nome, email, senha_hash) VALUES (?,?,?)', [nome, email, senhaHash]);
        return { id: resultado.insertId, nome, email };
    }
    catch(error) {
        console.error("Erro ao criar usuário", error);
        throw error;
    }
}

async function buscarPorEmail(email : string) {
    try {
        const [resultado] = await pool.query<RowDataPacket[]>('SELECT * FROM usuarios WHERE email = ?', [email]);
        return resultado[0];
    }
    catch(error) {
        console.error("Erro ao buscar usuário", error);
        throw error;
    }
}

module.exports = { criar, buscarPorEmail }