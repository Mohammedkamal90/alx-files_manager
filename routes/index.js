const express = require('express');
const UsersController = require('../controllers/UsersController');
const AuthController = require('../controllers/AuthController');

const router = express.Router();

// Define endpoints for authentication
router.get('/connect', AuthController.connect);
router.get('/disconnect', AuthController.disconnect);
router.get('/users/me', UsersController.getMe);

module.exports = router;
