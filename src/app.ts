import express = require('express');
import categoriaRoutes = require('./routes/categoriaRoutes');
import transacaoRoutes = require('./routes/transacaoRoutes');
import usuarioRoutes = require('./routes/usuarioRoutes');
import tratarErros = require('./middlewares/tratarErros');

const app = express();

app.use(express.json());
app.use(categoriaRoutes);
app.use(transacaoRoutes);
app.use(usuarioRoutes);
app.use(tratarErros);

export = app