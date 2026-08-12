const pool = require('../config/database');

async function criar(nome, email, senhaHash) {
    try {
        const [resultado] = await pool.query('INSERT INTO usuarios (nome, email, senha_hash) VALUES (?,?,?)', [nome, email, senhaHash]);
        return { id: resultado.insertId, nome, email };
    }
    catch(error) {
        console.error("Erro ao criar usuário", error);
        throw error;
    }
}

async function buscarPorEmail(email) {
    try {
        const [resultado] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        return resultado[0];
    }
    catch(error) {
        console.error("Erro ao buscar usuário", error);
        throw error;
    }
}

module.exports = { criar, buscarPorEmail }