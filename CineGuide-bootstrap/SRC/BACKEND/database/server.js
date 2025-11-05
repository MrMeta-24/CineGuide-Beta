const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const filmesRouter = require('../routes/filmes');
const usuariosRouter = require('./routes/usuarios');

const app = express();
const PORT = 5500;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/filmes', filmesRouter);
app.use('/api/usuarios', usuariosRouter);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
