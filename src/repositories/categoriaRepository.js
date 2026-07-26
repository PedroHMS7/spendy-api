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

async function criar(nome,tipo) {
    try {
        const [resultado] = await pool.query('INSERT INTO categorias (nome, tipo) VALUES (?, ?)', [nome, tipo]);
        return { id: resultado.insertId, nome, tipo };
    }
    catch (error){
        console.error("Erro ao criar", error)
        throw error;
    }
}

async function atualizar(id,dados) {
    const { nome, tipo } = dados;

    try {
        const [resultado] = await pool.query('UPDATE categorias SET nome = ?, tipo = ?  WHERE id = ?', [nome,tipo,id]);

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

async function excluir(id) {
    try {
        const [categoriaExcluida] = await pool.query('DELETE FROM categorias WHERE id = ?', [id]);

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


module.exports = {buscarTodas,criar,atualizar,excluir};