const express = require('express');
const app = express();

app.use(express.json());

const categoriaRoutes = require('./routes/categoriaRoutes')

app.use(categoriaRoutes)

module.exports = app