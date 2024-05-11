import express from 'express';
import routes from './routes'; // Import routes from routes/index.js

const app = express();
const PORT = process.env.PORT || 5000; // Get port from environment variable or default to 5000

app.use('/', routes); // Mount routes at root path '/'

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

