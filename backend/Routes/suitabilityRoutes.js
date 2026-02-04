/**
 * Suitability Routes
 * Routes for AI-powered plantation suitability analysis
 */

import express from 'express';
import {
    evaluateSuitability,
    getSuitabilityHistory,
    getSuitabilityReport,
    getSuitabilityStats
} from '../Controllers/suitabilityController.js';
import { validateLocation } from '../Middlewares/validateLocation.js';
import { aiRateLimiter, generalRateLimiter } from '../Middlewares/rateLimitAI.js';

const router = express.Router();

/**
 * @route   POST /api/suitability/evaluate
 * @desc    Evaluate plantation suitability using AI
 * @access  Public (with strict rate limiting)
 * @body    { projectName, location, plantationSize, treeType, userId }
 */
router.post('/evaluate', aiRateLimiter, validateLocation, evaluateSuitability);

/**
 * @route   GET /api/suitability/history
 * @desc    Get suitability report history for a user
 * @access  Public
 * @query   userId, limit, status
 */
router.get('/history', generalRateLimiter, getSuitabilityHistory);

/**
 * @route   GET /api/suitability/reports/:id
 * @desc    Get a specific suitability report by ID
 * @access  Public
 */
router.get('/reports/:id', generalRateLimiter, getSuitabilityReport);

/**
 * @route   GET /api/suitability/stats
 * @desc    Get statistics about suitability evaluations
 * @access  Public
 */
router.get('/stats', generalRateLimiter, getSuitabilityStats);

export default router;
