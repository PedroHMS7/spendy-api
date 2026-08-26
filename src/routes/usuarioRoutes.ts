import express = require('express');
import usuarioController = require('../controllers/usuarioController');

const router = express.Router();

router.post('/usuarios/registro', usuarioController.registrar);

router.post('/usuarios/login', usuarioController.login);

export = router;
