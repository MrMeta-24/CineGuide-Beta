const express = require('express');
const router = express.Router();
const db = require('../database/db');

router.get('/', (req, res) => {
  db.all('SELECT * FROM filmes', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    rows.forEach(row => {
      row.atores = row.atores ? JSON.parse(row.atores) : [];
      row.opinioes = row.opinioes ? JSON.parse(row.opinioes) : [];
    });
    res.json(rows);
  });
});

router.post('/', (req, res) => {
  const { nome, diretor, roteirista, atores, genero, classificacao, nota, sinopse, opinioes, imagem } = req.body;

  const sql = `
    INSERT INTO filmes 
    (nome, diretor, roteirista, atores, genero, classificacao, nota, sinopse, opinioes, imagem) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [
    nome,
    diretor,
    roteirista,
    JSON.stringify(atores || []),
    genero,
    classificacao,
    nota,
    sinopse,
    JSON.stringify(opinioes || []),
    imagem
  ], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

module.exports = router;
