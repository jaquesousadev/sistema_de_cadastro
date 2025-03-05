const express = require('express');
const router = express.Router();
const Client = require('../models/clientModel');
const db = require("../config/db"); // Importa a conexão com o banco de dados


// Rota para registrar clientes
router.post('/create', (req, res) => {
  const clientData = {
    empresa: req.body.empresa,
    operadora: req.body.operadora,
    plano: req.body.plano,
    apolice: req.body.apolice,
    valor: req.body.valor,
    responsavel: req.body.responsavel,
    vencimento: req.body.vencimento,
    vidas: req.body.vidas,
    phone: req.body.phone,
    email: req.body.email,
    senha_email: req.body.senha_email,
    mes_reajuste: req.body.mes_reajuste,
    login_portal: req.body.login_portal,
    senha_portal: req.body.senha_portal,
    cnpj_cliente: req.body.cnpj_cliente,
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
      vencimento: req.body.vencimento,
      vidas: req.body.vidas,
      phone: req.body.phone,
      email: req.body.email,
      senha_email: req.body.senha_email,
      mes_reajuste: req.body.mes_reajuste,
      login_portal: req.body.login_portal,
      senha_portal: req.body.senha_portal,
      cnpj_cliente: req.body.cnpj_cliente,
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
  
  // Rota para obter os dados do dashboard
router.get('/dashboard-data', async (req, res) => {
  try {
      // Consulta total de clientes
      const [clientes] = await db.execute('SELECT COUNT(*) AS total FROM clients');
      
      // Consulta clientes com boletos vencendo hoje
      const hoje = new Date().toISOString().split('T')[0];
      const [clientesVencendo] = await db.execute('SELECT COUNT(*) AS vencendo FROM clients WHERE vencimento = ?', [hoje]);

      res.json({
          totalClientes: clientes[0].total,
          clientesVencendo: clientesVencendo[0].vencendo
      });
  } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error);
      res.status(500).json({ error: "Erro ao buscar dados." });
  }
});
  
  
  

module.exports = router;
