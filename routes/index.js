import express from 'express';
import AppController from '../controllers/AppController'; // Import the controller
import UsersController from '../controllers/UsersController'; // Import UsersController

const router = express.Router();

// Define routes
router.get('/status', AppController.getStatus); // GET /status route handled by getStatus method in AppController
router.get('/stats', AppController.getStats); // GET /stats route handled by getStats method in AppController
router.post('/users', UsersController.postNew); // Add new endpoint for creating users

export default router;
