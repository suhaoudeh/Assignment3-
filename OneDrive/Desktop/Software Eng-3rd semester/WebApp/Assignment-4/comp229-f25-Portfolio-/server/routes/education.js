import express from 'express';
import {
  getAllEducation,
  getEducationById,
  createEducation,
  updateEducation,
  deleteEducation
} from '../controllers/education.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

// All education routes require authentication - users only manage their own entries
router.get('/', authMiddleware, getAllEducation);
router.get('/:id', authMiddleware, getEducationById);

// Protected routes (require authentication)
router.post('/', authMiddleware, createEducation);
router.put('/:id', authMiddleware, updateEducation);
router.delete('/:id', authMiddleware, deleteEducation);

export default router;
