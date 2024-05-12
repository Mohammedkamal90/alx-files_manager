const dbClient = require('../utils/db');

class FilesController {
  static async putPublish(req, res) {
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

    const updatedFile = await dbClient.updateFilePublishStatus(id, true);
    res.json(updatedFile);
  }

  static async putUnpublish(req, res) {
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

    const updatedFile = await dbClient.updateFilePublishStatus(id, false);
    res.json(updatedFile);
  }
}

module.exports = FilesController;
