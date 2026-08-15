const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const autenticar = require('../middlewares/autenticacao');

router.get('/categorias', autenticar, categoriaController.repassaTodos);

router.post('/categorias', autenticar, categoriaController.criar);

router.put('/categorias/:id', autenticar, categoriaController.atualizar);

router.delete('/categorias/:id', autenticar, categoriaController.excluir);

module.exports = router;
