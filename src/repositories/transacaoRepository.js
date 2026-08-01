const pool = require("../config/database");

async function buscarTodas(){
    try {
        const [linhas] = await pool.query('SELECT * FROM transacoes');
        return linhas.map(linha => ({ ...linha, valor: Number(linha.valor) }));
    } 
    catch(error){
        console.error("Erro ao buscar transação", error);
        throw error;
    }
}

async function criar(dados){
    const { descricao, valor, tipo, data, categoria_id} = dados;

    try {
        const [resultado] = await pool.query('INSERT INTO transacoes (descricao, valor, tipo, data, categoria_id) VALUES (?,?,?,?,?)',[descricao, valor, tipo, data, categoria_id]);
        return { id: resultado.insertId, descricao, valor, tipo, data, categoria_id };
    }
    catch(error) {
        console.error("Erro ao criar transação", error);
        throw error;
    }
}

module.exports = { buscarTodas, criar };