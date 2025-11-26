const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./filmes.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS filmes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      diretor TEXT NOT NULL,
      roteirista TEXT,
      atores TEXT,
      genero TEXT NOT NULL,
      classificacao TEXT,
      nota REAL DEFAULT NULL,
      sinopse TEXT,
      opinioes TEXT,
      imagem TEXT
    )
  `);
});

module.exports = db;
