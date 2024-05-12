const fs = require('fs');
const mime = require('mime-types');
const imageThumbnail = require('image-thumbnail');
const dbClient = require('../utils/dbClient');
const fileQueue = require('../utils/fileQueue');

async function postUpload(req, res) {
  try {
    // Retrieve user based on token
    const user = await dbClient.findUserById(req.user.id);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Validate request body
    const { name, type, data, parentId, isPublic } = req.body;
    if (!name || !type || !data) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Handle parentId validation
    let parentFolder = null;
    if (parentId) {
      parentFolder = await dbClient.findFileById(parentId);
      if (!parentFolder) {
        return res.status(400).json({ error: 'Parent not found' });
      }
      if (parentFolder.type !== 'folder') {
        return res.status(400).json({ error: 'Parent is not a folder' });
      }
    }

    // Save the file locally
    const fileBuffer = Buffer.from(data, 'base64');
    const fileId = dbClient.generateId();
    const filePath = `/tmp/files_manager/${fileId}`;
    fs.writeFileSync(filePath, fileBuffer);

    // Save file details to database
    const newFile = await dbClient.saveFile({
      userId: user.id,
      name,
      type,
      isPublic: isPublic || false,
      parentId: parentId || '0',
      localPath: filePath,
    });

    // Add a job to the fileQueue for generating thumbnails
    if (type === 'image') {
      fileQueue.add({ userId: user.id, fileId: newFile.id });
    }

    res.status(201).json(newFile);
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function getFile(req, res) {
  try {
    const fileId = req.params.id;
    const user = req.user;

    // Retrieve file from database
    const file = await dbClient.findFileById(fileId);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Check if file is public or user is owner
    if (!file.isPublic && (!user || file.userId !== user.id)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Handle thumbnail size
    const size = req.query.size;
    if (size && file.type === 'image') {
      const thumbnailPath = file.localPath.replace('.', `_${size}.`);
      if (!fs.existsSync(thumbnailPath)) {
        return res.status(404).json({ error: 'Thumbnail not found' });
      }
      return res.sendFile(thumbnailPath);
    }

    return res.sendFile(file.localPath);
  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function generateThumbnails(job) {
  try {
    const { userId, fileId } = job.data;

    if (!userId || !fileId) {
      throw new Error('Missing userId or fileId');
    }

    // Retrieve file from database
    const file = await dbClient.findFileById(fileId, userId);
    if (!file) {
      throw new Error('File not found');
    }

    // Generate thumbnails
    const thumbnailSizes = [500, 250, 100];
    for (const size of thumbnailSizes) {
      const thumbnailOptions = { width: size };
      const thumbnailBuffer = await imageThumbnail(file.localPath, thumbnailOptions);
      const thumbnailPath = file.localPath.replace('.', `_${size}.`);
      fs.writeFileSync(thumbnailPath, thumbnailBuffer);
    }
  } catch (error) {
    console.error('Error generating thumbnails:', error);
  }
}

module.exports = { postUpload, getFile, generateThumbnails };
