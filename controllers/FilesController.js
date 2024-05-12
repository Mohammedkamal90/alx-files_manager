const dbClient = require('../utils/db');
const fs = require('fs');
const mime = require('mime-types');
const Bull = require('bull');

const fileQueue = new Bull('fileQueue');

class FilesController {
  static async postUpload(req, res) {
    // your existing code to create a new file in DB and in disk

    // Check if the file type is image
    if (req.body.type === 'image') {
      // Add a job to the queue to generate thumbnails
      fileQueue.add({
        userId: req.user._id,
        fileId: newFile._id
      });
    }

    // return response
  }
}

module.exports = FilesController;
