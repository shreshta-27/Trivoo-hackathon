import express from 'express';
import { createSession, getNearSessions, joinSession, getSpeciesList } from '../Controllers/plantingController.js';
import { protect } from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createSession);
router.get('/nearby', getNearSessions);
router.put('/:id/join', protect, joinSession);
router.get('/species', getSpeciesList);

export default router;
