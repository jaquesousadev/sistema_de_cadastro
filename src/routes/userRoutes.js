const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.get('/', userController.getAllUsers); // Rota para buscar todos os usuários

module.exports = router;
