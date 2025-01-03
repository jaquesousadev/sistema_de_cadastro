const express = require('express');
const router = express.Router();
const Client = require('../models/clientModel');

// Rota para registrar clientes
router.post('/create', (req, res) => {
  const clientData = {
    empresa: req.body.empresa,
    operadora: req.body.operadora,
    plano: req.body.plano,
    apolice: req.body.apolice,
    valor: req.body.valor,
    responsavel: req.body.responsavel,
    phone: req.body.phone,
    email: req.body.email,
    senha_email: req.body.senha_email,
    mes_reajuste: req.body.mes_reajuste,
    login_portal: req.body.login_portal,
    senha_portal: req.body.senha_portal,
    plataforma: req.body.plataforma
  };

  console.log("Dados do cliente para criar:", clientData); // log dos dados

  Client.create(clientData, (err, result) => {
    if (err) {
      console.error("Erro ao criar cliente:", err); // Log de erro
      return res.status(500).json({ success: false, message: err.message });
    }
    res.json({ success: true, message: 'Cliente registrado com sucesso!' });
  });
});

// Rota para listar todos os clientes
router.get('/', (req, res) => {
    Client.findAll((err, clients) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }
      res.json({ success: true, clients });
    });
  });

  // Rota para buscar os detalhes de um cliente específico
router.get('/:id', (req, res) => {
    const clientId = req.params.id;
  
    Client.findById(clientId, (err, client) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }
      if (!client) {
        return res.status(404).json({ success: false, message: 'Cliente não encontrado' });
      }
      res.json(client);
    });
  });

  // Rota para atualizar um cliente específico
router.put('/:id', (req, res) => {
    const clientId = req.params.id;
    const clientData = {
      empresa: req.body.empresa,
      operadora: req.body.operadora,
      plano: req.body.plano,
      apolice: req.body.apolice,
      valor: req.body.valor,
      responsavel: req.body.responsavel,
      phone: req.body.phone,
      email: req.body.email,
      senha_email: req.body.senha_email,
      mes_reajuste: req.body.mes_reajuste,
      login_portal: req.body.login_portal,
      senha_portal: req.body.senha_portal,
      plataforma: req.body.plataforma
    };

    console.log("Dados do cliente para atualizar:", clientData); // Log dos dados recebidos
  
    Client.updateById(clientId, clientData, (err, result) => {
      if (err) {
        console.error("Erro ao atualizar cliente:", err); // Log de erro
        return res.status(500).json({ success: false, message: err.message });
      }
      res.json({ success: true, message: 'Cliente atualizado com sucesso!' });
    });
  });

  // Rota para excluir um cliente específico
router.delete('/:id', (req, res) => {
    const clientId = req.params.id;
  
    Client.deleteById(clientId, (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }
      res.json({ success: true, message: 'Cliente excluído com sucesso!' });
    });
  });
  
  
  
  

module.exports = router;
