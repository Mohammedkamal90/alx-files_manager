import express from 'express';
import AppController from '../controllers/AppController'; // Import the controller

const router = express.Router();

// Define routes
router.get('/status', AppController.getStatus); // GET /status route handled by getStatus method in AppController
router.get('/stats', AppController.getStats); // GET /stats route handled by getStats method in AppController

export default router;
