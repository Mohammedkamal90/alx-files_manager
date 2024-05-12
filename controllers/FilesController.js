const dbClient = require('../utils/db');

class FilesController {
  static async getShow(req, res) {
    const { id } = req.params;
    const { user } = req;
    
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const file = await dbClient.getFileById(user._id, id);

    if (!file) {
      res.status(404).json({ error: 'Not found' });
      return;
    }

    res.json(file);
  }

  static async getIndex(req, res) {
    const { parentId = '0', page = '0' } = req.query;
    const { user } = req;

    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const files = await dbClient.getFilesByParentId(user._id, parentId, parseInt(page));

    res.json(files);
  }
}

module.exports = FilesController;
