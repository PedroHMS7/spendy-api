const pool = require("../config/database");

async function buscarTodas() {
    try {
        const [linhas] = await pool.query('SELECT * FROM categorias');
        return linhas;
    }
    catch (error) {
        console.error("Erro ao buscar", error)
        throw error;
    }
}

async function criar(nome,tipo){
    try {
        const [resultado] = await pool.query('INSERT INTO categorias (nome, tipo) VALUES (?, ?)', [nome, tipo]);
        return { id: resultado.insertId, nome, tipo };
    }
    catch (error){
        console.error("Erro ao criar", error)
        throw error;
    }
}


module.exports = {buscarTodas,criar};