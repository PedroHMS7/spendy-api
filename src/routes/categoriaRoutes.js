const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

router.get('/categorias', categoriaController.repassaTodos);

module.exports = router;
