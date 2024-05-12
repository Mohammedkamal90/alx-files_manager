const express = require('express');
const FilesController = require('../controllers/FilesController');
const router = express.Router();

router.put('/files/:id/publish', FilesController.putPublish);
router.put('/files/:id/unpublish', FilesController.putUnpublish);

module.exports = router;
