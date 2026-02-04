import express from 'express';
import { assessSuitability } from '../Controllers/suitabilityController.js';
import { protect } from '../Middleware/authMiddleware.js';

const router = express.Router();

router.post('/assess', protect, assessSuitability);

export default router;
