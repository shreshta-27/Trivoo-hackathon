import express from 'express';
import {
    triggerNewsAnalysis,
    getProjectIncidents,
    getUserIncidents,
    getDailyNewsFeed
} from '../Controllers/newsController.js';
import { protect } from '../Middlewares/authMiddleware.js';

const router = express.Router();

// Trigger Analysis (Manual / Cron)
// Protected to avoid spamming the AI
router.post('/trigger', protect, triggerNewsAnalysis);

// Get incidents for a specific project
router.get('/project/:projectId', protect, getProjectIncidents);

// Get all incidents for the logged-in user's dashboard
router.get('/dashboard', protect, getUserIncidents);

// Get general daily environmental news feed
router.get('/feed', protect, getDailyNewsFeed);

export default router;
