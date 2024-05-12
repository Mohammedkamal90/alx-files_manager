const express = require('express');
const UsersController = require('../controllers/UsersController');
const AuthController = require('../controllers/AuthController');
const FilesController = require('../controllers/FilesController');

const router = express.Router();

// Define endpoints for authentication
router.get('/connect', AuthController.connect);
router.get('/disconnect', AuthController.disconnect);
router.get('/users/me', UsersController.getMe);

// Define endpoint for uploading files
router.post('/files', FilesController.postUpload);

module.exports = router;
