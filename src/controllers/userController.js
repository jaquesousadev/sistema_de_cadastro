const User = require('../models/userModel');

exports.register = (req, res) => {
  const newUser = req.body;
  User.create(newUser, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ success: true, message: 'Usuário registrado com sucesso!', data: result });
  });
};

exports.getAllUsers = (req, res) => {
  User.findAll((err, users) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(users);
  });
};
