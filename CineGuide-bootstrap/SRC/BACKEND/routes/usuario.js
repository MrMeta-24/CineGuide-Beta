const express = require('express');
const userRouter = express.Router();
const db = require('../database/db');

userRouter.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  const sql = `INSERT INTO usuarios (username, email, password) VALUES (?, ?, ?)`;

  db.run(sql, [username, email, password], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: 'Email já registrado.' });
      }
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID });
  });
});

userRouter.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = `SELECT * FROM usuarios WHERE email = ? AND password = ?`;
  db.get(sql, [email, password], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(401).json({ error: 'Email ou senha incorretos.' });
    res.json({ id: row.id, username: row.username, email: row.email });
  });
});

module.exports = userRouter;
