const dbClient = require('../utils/db');
const sha1 = require('sha1');

class UsersController {
  // Method to create a new user
  static async create(req, res) {
    // Extract email and password from request body
    const { email, password } = req.body;

    try {
      // Validate if email and password are provided
      if (!email) {
        return res.status(400).json({ error: 'Missing email' });
      }
      if (!password) {
        return res.status(400).json({ error: 'Missing password' });
      }

      // Check if email already exists in the database
      const userExists = await dbClient.userExists(email);
      if (userExists) {
        return res.status(400).json({ error: 'Already exist' });
      }

      // Hash the password using SHA1
      const hashedPassword = sha1(password);

      // Create a new user in the database
      const newUser = await dbClient.createUser(email, hashedPassword);

      // Extract the user ID
      const id = newUser.insertedId;

      // Return the new user with email and ID
      return res.status(201).json({ id, email });
    } catch (error) {
      // Handle any unexpected errors
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = UsersController;
