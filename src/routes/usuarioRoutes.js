const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.post('/usuarios/registro', usuarioController.registrar);

router.post('/usuarios/login', usuarioController.login);

module.exports = router;
