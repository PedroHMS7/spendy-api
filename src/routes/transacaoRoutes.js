const express = require('express');
const router = express.Router();
const transacaoController = require('../controllers/transacaoController');

router.get('/transacoes', transacaoController.repassaTodos);

router.post('/transacoes', transacaoController.criar);

router.put('/transacoes/:id', transacaoController.atualizar);

router.delete('/transacoes/:id', transacaoController.excluir);

module.exports = router;