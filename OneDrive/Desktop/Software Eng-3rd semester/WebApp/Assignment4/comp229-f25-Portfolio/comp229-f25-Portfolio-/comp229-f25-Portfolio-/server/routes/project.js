import express from 'express';
import {
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    createProject
} from '../controllers/project.js'

import authMiddleware from '../middlewares/auth.js';

// Router /projects
const router = express.Router();

// HTTP Verbs for RESTful APIs GET, POST, PUT, DELETE
router.get('/', authMiddleware, getAllProjects);
router.get('/:id', authMiddleware, getProjectById);
router.post('/', authMiddleware, createProject);
router.put('/:id', authMiddleware, updateProject);
router.delete('/:id', authMiddleware, deleteProject);

export default router;