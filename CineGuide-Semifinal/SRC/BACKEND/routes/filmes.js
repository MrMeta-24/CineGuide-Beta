const express = require('express');
const router = express.Router();
const db = require('../database/db');

function processarFilme(row) {
  if (row) {
    try {
      row.atores = row.atores ? JSON.parse(row.atores) : [];
      row.opinioes = row.opinioes ? JSON.parse(row.opinioes) : [];
    } catch (e) {
      row.atores = [];
      row.opinioes = [];
    }
  }
}


router.get('/', (req, res) => {
  const sql = `SELECT rowid AS id, * FROM filmes`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Erro ao listar filmes:", err.message);
      return res.status(500).json({ error: err.message });
    }

    rows.forEach(processarFilme);

    res.json(rows);
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  console.log("Buscando filme com ID:", id);

  const sql = `SELECT rowid AS id, * FROM filmes WHERE rowid = ?`;

  db.get(sql, [id], (err, row) => {
    if (err) {
      console.error("Erro ao buscar filme:", err.message);
      return res.status(500).json({ error: err.message });
    }

    if (!row) {
      console.warn("Filme não encontrado com ID:", id);
      return res.status(404).json({ error: "Filme não encontrado." });
    }

    processarFilme(row);

    res.json(row);
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
    if (err) {
      console.error("Erro ao inserir filme:", err.message);
      return res.status(500).json({ error: err.message });
    }

    console.log("Filme cadastrado com sucesso! ID:", this.lastID);
    res.json({ id: this.lastID });
  });
});

router.delete('/api/delete/id', (req, res) => {
  const { id } = req.params;
  console.log("Tentativa de apagar filme com ID:", id);

  const sql = `DELETE FROM filmes WHERE rowid = ?`;

  db.run(sql, [id], function(err) {
    if (err) {
      console.error("Erro ao apagar filme:", err.message);
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      console.warn("Nenhum filme encontrado para apagar com ID:", id);
      return res.status(404).json({ error: "Filme não encontrado para apagar." });
    }

    console.log(`Filme com ID ${id} apagado com sucesso.`);
    res.json({ message: `Filme com ID ${id} apagado com sucesso.` });
  });
});

module.exports = router;