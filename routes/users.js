const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const db = require('../config/db');

// Rota de registro
router.post('/register', (req, res) => {
  const { username, password, email } = req.body;

  // Verificar se todos os campos foram preenchidos
  if (!username || !password || !email) {
    return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios.' });
  }

  // Adicionar lógica de inserção no banco de dados
  const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
  db.query(query, [username, password, email], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
    res.json({ success: true, message: 'Usuário registrado com sucesso!' });
  });
});

module.exports = router;
