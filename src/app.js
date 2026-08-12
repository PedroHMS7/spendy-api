const express = require('express');
const app = express();

app.use(express.json());

const categoriaRoutes = require('./routes/categoriaRoutes');

app.use(categoriaRoutes);

const transacaoRoutes = require('./routes/transacaoRoutes');

app.use(transacaoRoutes);

const usuarioRoutes = require('./routes/usuarioRoutes');

app.use(usuarioRoutes);

module.exports = app