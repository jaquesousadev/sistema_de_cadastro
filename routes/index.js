const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

// Página inicial
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

// Rota de login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

    
  User.findByUsername(username, (err, users) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }

    if (users.length === 0) {
      return res.status(400).json({ success: false, message: 'Credenciais inválidas' });
    }

    const user = users[0];
    if (user.password !== password) {
      return res.status(400).json({ success: false, message: 'Credenciais inválidas' });
    }

    res.json({ success: true });
  });
});

module.exports = router;
