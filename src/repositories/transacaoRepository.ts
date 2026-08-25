import pool = require('../config/database');
import { ResultSetHeader, RowDataPacket } from 'mysql2';

async function buscarTodas(filtros : {tipo?: string, categoria_id?: number}, page : number, limit : number, usuario_id : number) {  
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

        const [linhas] = await pool.query<RowDataPacket[]>(query, parametros);
        return linhas.map(linha => ({ ...linha, valor: Number(linha.valor) }));
    }
    catch (error) {
        console.error("Erro ao buscar transação", error);
        throw error;
    }
}

async function criar(dados : {descricao : string, valor : number, tipo : string, data : string, categoria_id : number }, usuario_id : number) {
    const { descricao, valor, tipo, data, categoria_id } = dados;

    try {
        const [resultado] = await pool.query<ResultSetHeader>('INSERT INTO transacoes (descricao, valor, tipo, data, categoria_id,usuario_id) VALUES (?,?,?,?,?,?)', [descricao, valor, tipo, data, categoria_id, usuario_id]);
        return { id: resultado.insertId, descricao, valor, tipo, data, categoria_id, usuario_id };
    }
    catch (error) {
        console.error("Erro ao criar transação", error);
        throw error;
    }
}

async function atualizar(id : number, dados : {descricao : string, valor : number, tipo : string, data : string, categoria_id : number }, usuario_id : number) {
    const { descricao, valor, tipo, data, categoria_id } = dados;

    try {
        const [resultado] = await pool.query<ResultSetHeader>('UPDATE transacoes SET descricao = ?, valor = ?, tipo = ?, data = ?, categoria_id = ? WHERE id = ? AND usuario_id = ?', [descricao, valor, tipo, data, categoria_id, id, usuario_id]);

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

async function excluir(id : number, usuario_id : number) {
    try {
        const [resultado] = await pool.query<ResultSetHeader>('DELETE FROM transacoes WHERE id = ? AND usuario_id = ?', [id, usuario_id]);

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

export = { buscarTodas, criar, atualizar, excluir };