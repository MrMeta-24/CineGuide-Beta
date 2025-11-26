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
  const sql = `SELECT * FROM filmes`;

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
  const sql = `SELECT * FROM filmes WHERE id = ?`;

  db.get(sql, [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Filme não encontrado." });

    processarFilme(row);
    res.json(row);
  });
});

router.post('/', (req, res) => {
  const { nome, diretor, roteirista, atores, genero, classificacao, sinopse, opinioes, imagem } = req.body;

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
    null,
    sinopse,
    JSON.stringify(opinioes || []),
    imagem
  ], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

router.post('/:id/opiniao', (req, res) => {
  const { id } = req.params;
  const { usuario, comentario, nota } = req.body;

  if (!usuario || !comentario || typeof nota !== "number") {
    return res.status(400).json({ error: "Dados inválidos." });
  }

  db.get(`SELECT * FROM filmes WHERE id = ?`, [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Filme não encontrado." });

    let opinioes = [];
    try {
      opinioes = row.opinioes ? JSON.parse(row.opinioes) : [];
    } catch {
      opinioes = [];
    }

    opinioes.push({ usuario, comentario, nota });

    const notasValidas = opinioes.map(o => Number(o.nota)).filter(n => !isNaN(n));
    const media = notasValidas.length ? notasValidas.reduce((a,b) => a+b, 0)/notasValidas.length : null;

    const sqlUpdate = `
      UPDATE filmes 
      SET opinioes = ?, nota = ?
      WHERE id = ?
    `;

    db.run(sqlUpdate, [JSON.stringify(opinioes), media, id], function (err2) {
      if (err2) return res.status(500).json({ error: err2.message });

      res.json({
        message: "Opinião adicionada com sucesso!",
        novaMedia: media,
        opinioes
      });
    });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM filmes WHERE id = ?`, [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Filme não encontrado para apagar." });

    res.json({ message: `Filme com ID ${id} apagado com sucesso.` });
  });
});

module.exports = router;
