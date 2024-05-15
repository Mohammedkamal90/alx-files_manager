import { v4 as uuidv4 } from 'uuid';
import sha1 from 'sha1';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

const getConnect = async (req, res) => {
  const auth = req.headers.authorization.split(' ')[1];
  const credentials = Buffer.from(auth, 'base64').toString().split(':');
  const email = credentials[0];
  const password = credentials[1];

  const user = await dbClient.db.collection('users').findOne({ email, password: sha1(password) });
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const token = uuidv4();
  await redisClient.set(`auth_${token}`, user._id.toString(), 86400);

  return res.status(200).json({ token });
};

const getDisconnect = async (req, res) => {
  const token = req.headers['x-token'];
  const userId = await redisClient.get(`auth_${token}`);

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  await redisClient.del(`auth_${token}`);

  return res.status(204).end();
};

export { getConnect, getDisconnect };
