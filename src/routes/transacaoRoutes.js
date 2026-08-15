const express = require('express');
const router = express.Router();
const transacaoController = require('../controllers/transacaoController');
const autenticar = require('../middlewares/autenticacao');

router.get('/transacoes', autenticar, transacaoController.repassaTodos);

router.post('/transacoes', transacaoController.criar);

router.put('/transacoes/:id', transacaoController.atualizar);

router.delete('/transacoes/:id', transacaoController.excluir);

module.exports = router;