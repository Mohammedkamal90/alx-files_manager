const express = require('express');
const FilesController = require('../controllers/FilesController');
const router = express.Router();

router.get('/files/:id', FilesController.getShow);
router.get('/files', FilesController.getIndex);

module.exports = router;
