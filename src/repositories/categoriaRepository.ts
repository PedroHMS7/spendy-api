import pool = require('../config/database');
import { ResultSetHeader, RowDataPacket } from 'mysql2';

async function buscarTodas(usuario_id : number) {
    try {
        const [linhas] = await pool.query<RowDataPacket[]>('SELECT * FROM categorias WHERE usuario_id = ?', [usuario_id]);
        return linhas;
    }
    catch (error) {
        console.error("Erro ao buscar", error)
        throw error;
    }
}

async function buscarPorId(id : number, usuario_id : number) {
    try {
        const [linhas] = await pool.query<RowDataPacket[]>('SELECT * FROM categorias WHERE id = ? AND usuario_id = ?', [id,usuario_id]);
        return linhas[0];
    }
    catch(error) {
        console.error("Erro ao buscar por ID", error);
        throw error;
    }
}

async function criar(nome : string, tipo : string, usuario_id : number) {
    try {
        const [resultado] = await pool.query<ResultSetHeader>('INSERT INTO categorias (nome, tipo, usuario_id) VALUES (?, ?, ?)', [nome, tipo, usuario_id]);
        return { id: resultado.insertId, nome, tipo, usuario_id };
    }
    catch (error){
        console.error("Erro ao criar", error)
        throw error;
    }
}

async function atualizar(id : number, dados: { nome: string, tipo: string }, usuario_id : number) {
    const { nome , tipo } = dados;

    try {
        const [resultado] = await pool.query<ResultSetHeader>('UPDATE categorias SET nome = ?, tipo = ?  WHERE id = ? AND usuario_id = ?', [nome,tipo,id,usuario_id]);

        if(resultado.affectedRows === 0){
            return null;
        }

        return { id: Number(id), nome, tipo}
    }
    catch(error) {
        console.error("Erro ao atualizar categoria no banco", error)
        throw error;
    }
}

async function excluir(id : number, usuario_id : number) {
    try {
        const [categoriaExcluida] = await pool.query<ResultSetHeader>('DELETE FROM categorias WHERE id = ? AND usuario_id = ?', [id,usuario_id]);

        if(categoriaExcluida.affectedRows === 0){
            return null;
        } 
    
        return Number(id);
    }
    catch(error) {
        console.error("Erro ao excluir categoria", error);
        throw error;
    }
}


export = { buscarTodas, criar, atualizar, excluir, buscarPorId };