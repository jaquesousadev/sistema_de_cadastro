const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

router.post('/create', clientController.create);
router.get('/', clientController.getAllClients);
router.get('/:id', clientController.getClientById);
router.put('/:id', clientController.updateClient);
router.delete('/:id', clientController.deleteClient);

module.exports = router;
