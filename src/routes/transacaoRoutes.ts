import express = require('express');
import autenticar = require('../middlewares/autenticacao');
import transacaoController = require('../controllers/transacaoController');

const router = express.Router();

router.get('/transacoes', autenticar, transacaoController.repassaTodos);

router.post('/transacoes', autenticar,transacaoController.criar);

router.put('/transacoes/:id', autenticar,transacaoController.atualizar);

router.delete('/transacoes/:id', autenticar,transacaoController.excluir);

export = router;