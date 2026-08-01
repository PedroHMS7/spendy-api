const express = require('express');
const router = express.Router();
const transacaoController = require('../controllers/transacaoController');

router.get('/transacoes', transacaoController.repassaTodos);

router.post('/transacoes', transacaoController.criar);

module.exports = router;