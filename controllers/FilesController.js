const dbClient = require('../utils/db');
const fs = require('fs');
const mime = require('mime-types');

class FilesController {
  static async getFile(req, res) {
    const { id } = req.params;
    const { user } = req;

    if (!user) {
      res.status(404).json({ error: 'Not found' });
      return;
    }

    const file = await dbClient.getFileById(id);

    if (!file || (!file.isPublic && file.userId !== user._id)) {
      res.status(404).json({ error: 'Not found' });
      return;
    }

    if (file.type === 'folder') {
      res.status(400).json({ error: "A folder doesn't have content" });
      return;
    }

    const filePath = file.localPath;

    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: 'Not found' });
      return;
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const mimeType = mime.lookup(file.name);

    res.setHeader('Content-Type', mimeType);
    res.send(fileContent);
  }
}

module.exports = FilesController;
