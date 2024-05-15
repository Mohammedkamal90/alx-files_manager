import express from 'express';
import { getStatus, getStats } from '../controllers/AppController';
import { postNew } from '../controllers/UsersController';
import { getConnect, getDisconnect } from '../controllers/AuthController';

const router = express.Router();

// App routes
router.get('/status', getStatus);
router.get('/stats', getStats);

// User routes
router.post('/users', postNew);

// Authentication routes
router.get('/connect', getConnect);
router.get('/disconnect', getDisconnect);

export default router;
