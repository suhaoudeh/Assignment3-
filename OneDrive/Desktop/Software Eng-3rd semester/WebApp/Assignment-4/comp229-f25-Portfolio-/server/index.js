import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import mongoose from "mongoose";
import dotenv from 'dotenv/config';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// __dirname replacement in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);
const connection = mongoose.connection;
connection.on('error', console.error.bind(console, "MongoDB connection error: "));
connection.once('open', () => { console.log('Connected to MongoDB'); });

import projectRoutes from './routes/project.js';
import userRoutes from './routes/user.js';
import educationRoutes from './routes/education.js';

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

app.use(morgan('dev'));
app.use(cors());

//Routes

app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes)
app.use('/api/education', educationRoutes);

app.use('/api/data', (req, res) => {
    res.json({ message: 'Hello from the API! Again' });
});

const clientBuildPath = path.join(__dirname, '../client/build');
const clientDistPath = path.join(__dirname, '../client/dist');

if (fs.existsSync(clientBuildPath)) {
    app.use(express.static(clientBuildPath));
} else if (fs.existsSync(clientDistPath)) {
    app.use(express.static(clientDistPath));
} else {
    console.warn('Client build not found. Run `npm --prefix client run build` to generate the static files.');
}

app.get( (req, res) => {
    const indexPathBuild = path.join(clientBuildPath, 'index.html');
    const indexPathDist = path.join(clientDistPath, 'index.html');

    if (fs.existsSync(indexPathBuild)) return res.sendFile(indexPathBuild);
    if (fs.existsSync(indexPathDist)) return res.sendFile(indexPathDist);

    res.status(404).send('Client build not found. Run `npm --prefix client run build`.');
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});