const dbClient = require('../utils/dbClient');
const userQueue = require('../utils/userQueue');

async function postUser(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    const existingUser = await dbClient.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const newUser = await dbClient.createUser(email, password);

    // Add job to send welcome email
    userQueue.add({ userId: newUser.id });

    return res.status(201).json({ id: newUser.id, email: newUser.email });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function sendWelcomeEmail(job) {
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
    console.error('Error sending welcome email:', error);
  }
}

module.exports = { postUser, sendWelcomeEmail };
