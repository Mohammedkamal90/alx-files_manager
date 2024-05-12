const { Worker, Queue, QueueScheduler } = require('bull');
const dbClient = require('./utils/dbClient');
const imageThumbnail = require('image-thumbnail');

// Create Bull queue for processing files
const fileQueue = new Queue('fileQueue');
const fileQueueScheduler = new QueueScheduler(fileQueue.name);

// Process fileQueue jobs
fileQueue.process(async (job) => {
  try {
    const { userId, fileId } = job.data;

    if (!userId) {
      throw new Error('Missing userId');
    }

    if (!fileId) {
      throw new Error('Missing fileId');
    }

    const fileDocument = await dbClient.findFileById(fileId, userId);
    if (!fileDocument) {
      throw new Error('File not found');
    }

    // Perform thumbnail generation for image files
    if (fileDocument.type === 'image') {
      const thumbnail500 = await imageThumbnail(fileDocument.localPath, { width: 500 });
      const thumbnail250 = await imageThumbnail(fileDocument.localPath, { width: 250 });
      const thumbnail100 = await imageThumbnail(fileDocument.localPath, { width: 100 });

      // Save generated thumbnails (assuming the path is the same as original file)
      await Promise.all([
        dbClient.saveThumbnail(`${fileDocument.localPath}_500`, thumbnail500),
        dbClient.saveThumbnail(`${fileDocument.localPath}_250`, thumbnail250),
        dbClient.saveThumbnail(`${fileDocument.localPath}_100`, thumbnail100),
      ]);
    }

    return { fileId, userId };
  } catch (error) {
    console.error('Error processing file queue job:', error);
    throw error; // Rethrow error to trigger retries
  }
});

// Create Bull queue for processing users
const userQueue = new Queue('userQueue');
const userQueueScheduler = new QueueScheduler(userQueue.name);

// Process userQueue jobs
userQueue.process(async (job) => {
  try {
    const { userId } = job.data;

    if (!userId) {
      throw new Error('Missing userId');
    }

    const user = await dbClient.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // In real implementation, send a welcome email using a third-party service like Mailgun
    console.log(`Welcome ${user.email}!`);
  } catch (error) {
    console.error('Error processing user queue job:', error);
    throw error; // Rethrow error to trigger retries
  }
});

module.exports = { fileQueue, userQueue };
