const categoriaRepository = require('../repositories/categoriaRepository');

async function listarTodas() {
    return await categoriaRepository.buscarTodas();
}

module.exports = {listarTodas};