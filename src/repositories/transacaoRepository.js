const pool = require("../config/database");

async function buscarTodas(filtros, page, limit, usuario_id) {  
    const { tipo, categoria_id } = filtros;

    try {
        let condicoes = [];
        let parametros = [];
        let query;

        let offset = (page - 1) * limit;

        if (tipo) {
            condicoes.push('tipo = ?');
            parametros.push(tipo);
        }
        if (categoria_id) {
            condicoes.push('categoria_id = ?');
            parametros.push(categoria_id);
        }

        condicoes.push('usuario_id = ?');
        parametros.push(usuario_id);

        if(condicoes.length > 0){
            query = 'SELECT * FROM transacoes WHERE ' + condicoes.join(' AND ');
        }
        else {
            query = 'SELECT * FROM transacoes';
        }

        query += ' LIMIT ? OFFSET ?';
        parametros.push(limit, offset);

        const [linhas] = await pool.query(query, parametros);
        return linhas.map(linha => ({ ...linha, valor: Number(linha.valor) }));
    }
    catch (error) {
        console.error("Erro ao buscar transação", error);
        throw error;
    }
}

async function criar(dados,usuario_id) {
    const { descricao, valor, tipo, data, categoria_id } = dados;

    try {
        const [resultado] = await pool.query('INSERT INTO transacoes (descricao, valor, tipo, data, categoria_id,usuario_id) VALUES (?,?,?,?,?,?)', [descricao, valor, tipo, data, categoria_id, usuario_id]);
        return { id: resultado.insertId, descricao, valor, tipo, data, categoria_id, usuario_id };
    }
    catch (error) {
        console.error("Erro ao criar transação", error);
        throw error;
    }
}

async function atualizar(id, dados, usuario_id) {
    const { descricao, valor, tipo, data, categoria_id } = dados;

    try {
        const [resultado] = await pool.query('UPDATE transacoes SET descricao = ?, valor = ?, tipo = ?, data = ?, categoria_id = ? WHERE id = ? AND usuario_id = ?', [descricao, valor, tipo, data, categoria_id, id, usuario_id]);

        if (resultado.affectedRows === 0) {
            return null;
        }

        return { id: Number(id), descricao, valor, tipo, data, categoria_id, usuario_id };
    }
    catch (error) {
        console.error("Erro ao atualizar transação", error);
        throw error;
    }

}

async function excluir(id, usuario_id) {
    try {
        const [resultado] = await pool.query('DELETE FROM transacoes WHERE id = ? AND usuario_id = ?', [id, usuario_id]);

        if (resultado.affectedRows === 0) {
            return null;
        }

        return Number(id);
    }
    catch (error) {
        console.error("Erro ao excluir transação", error);
        throw error;
    }
}

module.exports = { buscarTodas, criar, atualizar, excluir };