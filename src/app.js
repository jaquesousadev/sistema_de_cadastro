const express = require('express');
const app = express();
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const clientRoutes = require('./routes/clientRoutes');
const User = require('./models/userModel');

app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/users', userRoutes);
app.use('/clients', clientRoutes);

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Verifica as credenciais no banco de dados
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

// Adicionando a rota para servir o dashboard
app.get('/dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/register_client.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register_client.html'));
});

app.get('/list_users.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'list_user.html'));
});

app.get('/list_clients.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'list_clients.html')); // Nova rota
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
