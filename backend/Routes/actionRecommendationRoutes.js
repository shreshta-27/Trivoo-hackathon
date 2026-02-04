import express from 'express';
import {
    triggerActionRecommendation,
    getActiveRecommendations,
    getUserRecommendations,
    markRecommendationComplete,
    getRiskSignals
} from '../Controllers/actionRecommendationController.js';
import { aiRateLimiter, generalRateLimiter } from '../Middlewares/rateLimitAI.js';

const router = express.Router();

router.post('/project/:projectId/trigger', aiRateLimiter, triggerActionRecommendation);

router.get('/project/:projectId/active', generalRateLimiter, getActiveRecommendations);

router.get('/user/:userId/all', generalRateLimiter, getUserRecommendations);

router.post('/:recommendationId/complete', generalRateLimiter, markRecommendationComplete);

router.get('/project/:projectId/signals', generalRateLimiter, getRiskSignals);

export default router;
