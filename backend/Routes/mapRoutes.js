/**
 * Map Routes
 * Routes for map visualization and region data
 */

import express from 'express';
import { getMapData, getRegionDetails } from '../Controllers/mapController.js';
import { generalRateLimiter } from '../Middlewares/rateLimitAI.js';

const router = express.Router();

// Apply general rate limiting to all map routes
router.use(generalRateLimiter);

/**
 * @route   GET /api/map/data
 * @desc    Get all map data (regions with risk levels and projects)
 * @access  Public
 */
router.get('/data', getMapData);

/**
 * @route   GET /api/map/regions/:id
 * @desc    Get detailed information for a specific region
 * @access  Public
 */
router.get('/regions/:id', getRegionDetails);

export default router;
