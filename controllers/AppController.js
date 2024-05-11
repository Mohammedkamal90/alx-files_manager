import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AppController {
  static async getStatus(req, res) {
    // Check if Redis and database are alive
    const redisIsAlive = redisClient.isAlive();
    const dbIsAlive = dbClient.isAlive();
    
    // Create status object
    const status = { redis: redisIsAlive, db: dbIsAlive };

    // Send status response with status code 200
    res.status(200).json(status);
  }

  static async getStats(req, res) {
    try {
      // Retrieve number of users and files from the database
      const numUsers = await dbClient.nbUsers();
      const numFiles = await dbClient.nbFiles();
      
      // Create stats object
      const stats = { users: numUsers, files: numFiles };
      
      // Send stats response with status code 200
      res.status(200).json(stats);
    } catch (error) {
      // Handle errors
      console.error('Error getting stats:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default AppController;
