import { v4 as uuidv4 } from 'uuid';
import sha1 from 'sha1';
import dbClient from '../utils/db';

const postNew = async (req, res) => {
  const { email, password } = req.body;

  if (!email) return res.status(400).json({ error: 'Missing email' });
  if (!password) return res.status(400).json({ error: 'Missing password' });

  const userExists = await dbClient.db.collection('users').findOne({ email });
  if (userExists) return res.status(400).json({ error: 'Already exist' });

  const newUser = {
    email,
    password: sha1(password),
  };

  const { insertedId } = await dbClient.db.collection('users').insertOne(newUser);

  return res.status(201).json({ id: insertedId, email });
};

export { postNew };
