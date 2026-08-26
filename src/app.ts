import express = require('express');
import categoriaRoutes = require('./routes/categoriaRoutes');
import transacaoRoutes = require('./routes/transacaoRoutes');
import usuarioRoutes = require('./routes/usuarioRoutes');

const app = express();

app.use(express.json());
app.use(categoriaRoutes);
app.use(transacaoRoutes);
app.use(usuarioRoutes);

export = app