const Client = require('../models/clientModel');

exports.create = (req, res) => {
  const newClient = req.body;
  Client.create(newClient, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Cliente cadastrado com sucesso!', data: result });
  });
};

exports.getAllClients = (req, res) => {
  Client.findAll((err, clients) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(clients);
  });
};

exports.getClientById = (req, res) => {
  const id = req.params.id;
  Client.findById(id, (err, client) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!client.length) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    res.json(client[0]);
  });
};

exports.updateClient = (req, res) => {
  const id = req.params.id;
  const updatedClient = req.body;
  Client.updateById(id, updatedClient, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Cliente atualizado com sucesso!', data: result });
  });
};

exports.deleteClient = (req, res) => {
  const id = req.params.id;
  Client.deleteById(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Cliente excluído com sucesso!', data: result });
  });
};

