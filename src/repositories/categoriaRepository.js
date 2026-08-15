const pool = require("../config/database");

async function buscarTodas(usuario_id) {
    try {
        const [linhas] = await pool.query('SELECT * FROM categorias WHERE usuario_id = ?', [usuario_id]);
        return linhas;
    }
    catch (error) {
        console.error("Erro ao buscar", error)
        throw error;
    }
}

async function buscarPorId(id,usuario_id) {
    try {
        const [linhas] = await pool.query('SELECT * FROM categorias WHERE id = ? AND usuario_id = ?', [id,usuario_id]);
        return linhas[0];
    }
    catch(error) {
        console.error("Erro ao buscar por ID", error);
        throw error;
    }
}

async function criar(nome,tipo,usuario_id) {
    try {
        const [resultado] = await pool.query('INSERT INTO categorias (nome, tipo, usuario_id) VALUES (?, ?, ?)', [nome, tipo, usuario_id]);
        return { id: resultado.insertId, nome, tipo, usuario_id };
    }
    catch (error){
        console.error("Erro ao criar", error)
        throw error;
    }
}

async function atualizar(id,dados,usuario_id) {
    const { nome, tipo } = dados;

    try {
        const [resultado] = await pool.query('UPDATE categorias SET nome = ?, tipo = ?  WHERE id = ? AND usuario_id = ?', [nome,tipo,id,usuario_id]);

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

async function excluir(id,usuario_id) {
    try {
        const [categoriaExcluida] = await pool.query('DELETE FROM categorias WHERE id = ? AND usuario_id = ?', [id,usuario_id]);

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


module.exports = { buscarTodas, criar, atualizar, excluir, buscarPorId };