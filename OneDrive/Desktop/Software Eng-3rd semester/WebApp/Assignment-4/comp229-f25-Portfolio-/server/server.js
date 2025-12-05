 import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import 'dotenv/config';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import projectRoutes from './routes/project.js';
import userRoutes from './routes/user.js';
import educationRoutes from './routes/education.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(morgan('dev'));
// app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000', // React frontend on port 3000
  credentials: true
}));
// app.use(cors());

// Connect to MongoDB
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // stop server if DB connection fails
  });
} else {
  console.warn('MONGODB_URI not set — skipping mongoose connect');
}

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/data', (req, res) => {
  res.json({ message: 'Hello from the API!' });
});

// Serve static files from client/dist
app.use(express.static(path.join(__dirname, '../client/dist')));
app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

// SPA fallback - serve index.html for all non-API routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

export default app;
