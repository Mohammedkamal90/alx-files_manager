const Bull = require('bull');
const thumb = require('image-thumbnail');
const dbClient = require('./utils/db');

const fileQueue = new Bull('fileQueue');

fileQueue.process(async (job) => {
  const { userId, fileId } = job.data;

  if (!fileId) {
    throw new Error('Missing fileId');
  }

  if (!userId) {
    throw new Error('Missing userId');
  }

  const file = await dbClient.getFileById(fileId);

  if (!file || file.userId.toString() !== userId.toString()) {
    throw new Error('File not found');
  }

  // Generate thumbnails
  const thumbnail500 = await thumb(file.localPath, { width: 500 });
  const thumbnail250 = await thumb(file.localPath, { width: 250 });
  const thumbnail100 = await thumb(file.localPath, { width: 100 });

  // Save thumbnails with the same name as the original file but with width appended
  fs.writeFileSync(`${file.localPath}_500`, thumbnail500);
  fs.writeFileSync(`${file.localPath}_250`, thumbnail250);
  fs.writeFileSync(`${file.localPath}_100`, thumbnail100);
});
