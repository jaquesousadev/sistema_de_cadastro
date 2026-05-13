const express = require('express');
const router = express.Router();
const Client = require('../models/clientModel');
const db = require('../config/db');

function normalizarCampoOpcional(value) {
  return value === undefined || value === null || String(value).trim() === '' ? null : String(value).trim();
}

function montarClientData(body) {
  return {
    empresa: body.empresa,
    operadora: body.operadora,
    plano: body.plano,
    apolice: body.apolice,
    valor: body.valor,
    responsavel: body.responsavel,
    vencimento: body.vencimento,
    vidas: body.vidas,
    phone: body.phone,
    email: body.email,
    senha_email: body.senha_email,
    mes_reajuste: body.mes_reajuste,
    login_portal: body.login_portal,
    senha_portal: body.senha_portal,
    link_portal: normalizarCampoOpcional(body.link_portal),
    observacoes_boleto: normalizarCampoOpcional(body.observacoes_boleto),
    status_boleto: normalizarCampoOpcional(body.status_boleto) || 'Pendente',
    cnpj_cliente: body.cnpj_cliente,
    plataforma: body.plataforma
  };
}

router.post('/create', (req, res) => {
  const clientData = montarClientData(req.body);

  console.log('Dados do cliente para criar:', clientData);

  Client.create(clientData, (err) => {
    if (err) {
      console.error('Erro ao criar cliente:', err);
      return res.status(500).json({ success: false, message: err.message });
    }

    res.json({ success: true, message: 'Cliente registrado com sucesso!' });
  });
});

router.get('/', (req, res) => {
  Client.findAll((err, clients) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }

    res.json({ success: true, clients });
  });
});

router.get('/dashboard-data', async (req, res) => {
  db.query('SELECT COUNT(*) AS total FROM clients', (totalErr, clientes) => {
    if (totalErr) {
      console.error('Erro ao buscar total de clientes:', totalErr);
      return res.status(500).json({ error: 'Erro ao buscar dados.' });
    }

    const hoje = new Date().toISOString().split('T')[0];
    db.query('SELECT COUNT(*) AS vencendo FROM clients WHERE vencimento = ?', [hoje], (vencimentoErr, clientesVencendo) => {
      if (vencimentoErr) {
        console.error('Erro ao buscar clientes vencendo:', vencimentoErr);
        return res.status(500).json({ error: 'Erro ao buscar dados.' });
      }

      res.json({
        totalClientes: clientes[0]?.total || 0,
        clientesVencendo: clientesVencendo[0]?.vencendo || 0
      });
    });
  });
});

router.get('/:id', (req, res) => {
  const clientId = req.params.id;

  Client.findById(clientId, (err, client) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }

    if (!client) {
      return res.status(404).json({ success: false, message: 'Cliente nao encontrado' });
    }

    res.json(client);
  });
});

router.put('/:id', (req, res) => {
  const clientId = req.params.id;
  const clientData = montarClientData(req.body);

  console.log('Dados do cliente para atualizar:', clientData);

  Client.updateById(clientId, clientData, (err) => {
    if (err) {
      console.error('Erro ao atualizar cliente:', err);
      return res.status(500).json({ success: false, message: err.message });
    }

    res.json({ success: true, message: 'Cliente atualizado com sucesso!' });
  });
});

router.delete('/:id', (req, res) => {
  const clientId = req.params.id;

  Client.deleteById(clientId, (err) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }

    res.json({ success: true, message: 'Cliente excluido com sucesso!' });
  });
});

module.exports = router;
