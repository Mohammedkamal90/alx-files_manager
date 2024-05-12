const { v4: uuidv4 } = require('uuid');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

class AuthController {
  // Method to sign-in the user and generate authentication token
  static async connect(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const encodedCredentials = authHeader.split(' ')[1];
    const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString();
    const [email, password] = decodedCredentials.split(':');

    try {
      const user = await dbClient.getUser(email, password);
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = uuidv4();
      await redisClient.set(`auth_${token}`, user._id.toString(), 'EX', 86400);

      return res.status(200).json({ token });
    } catch (error) {
      console.error('Error signing in user:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Method to sign-out the user and delete authentication token
  static async disconnect(req, res) {
    const { token } = req.headers;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const userId = await redisClient.get(`auth_${token}`);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      await redisClient.del(`auth_${token}`);
      return res.status(204).end();
    } catch (error) {
      console.error('Error signing out user:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = AuthController;
