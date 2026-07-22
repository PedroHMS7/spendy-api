const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

router.get('/categorias', categoriaController.repassaTodos);

router.post('/categorias', categoriaController.criar);

module.exports = router;
