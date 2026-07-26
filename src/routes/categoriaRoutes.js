const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

router.get('/categorias', categoriaController.repassaTodos);

router.post('/categorias', categoriaController.criar);

router.put('/categorias/:id', categoriaController.atualizar);

router.delete('/categorias/:id', categoriaController.excluir);

module.exports = router;
