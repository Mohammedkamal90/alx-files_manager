const express = require('express');
const FilesController = require('../controllers/FilesController');
const router = express.Router();

router.get('/files/:id/data', FilesController.getFile);

module.exports = router;
