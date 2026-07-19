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

module.exports = {buscarTodas};