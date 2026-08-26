import express = require('express');
import autenticar = require('../middlewares/autenticacao');
import categoriaController = require('../controllers/categoriaController');

const router = express.Router();

router.get('/categorias', autenticar, categoriaController.repassaTodos);

router.post('/categorias', autenticar, categoriaController.criar);

router.put('/categorias/:id', autenticar, categoriaController.atualizar);

router.delete('/categorias/:id', autenticar, categoriaController.excluir);

export = router;
