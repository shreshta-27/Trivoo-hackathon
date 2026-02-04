/**
 * Project Routes
 * Routes for plantation project CRUD operations
 */

import express from 'express';
import {
    getAllProjects,
    getProjectById,
    createProject,
    updateProjectHealth,
    deleteProject,
    getCriticalProjects
} from '../Controllers/projectController.js';
import { validateLocation } from '../Middlewares/validateLocation.js';
import { generalRateLimiter } from '../Middlewares/rateLimitAI.js';

const router = express.Router();

// Apply general rate limiting
router.use(generalRateLimiter);

/**
 * @route   GET /api/projects/critical
 * @desc    Get all critical projects (high/critical stress)
 * @access  Public
 * @note    Must be before /:id route to avoid conflict
 */
router.get('/critical', getCriticalProjects);

/**
 * @route   GET /api/projects
 * @desc    Get all projects with optional filtering
 * @access  Public
 * @query   region, manager, riskLevel, status, minHealth, maxHealth
 */
router.get('/', getAllProjects);

/**
 * @route   GET /api/projects/:id
 * @desc    Get a single project by ID
 * @access  Public
 */
router.get('/:id', getProjectById);

/**
 * @route   POST /api/projects
 * @desc    Create a new project
 * @access  Protected (should add auth middleware in production)
 */
router.post('/', validateLocation, createProject);

/**
 * @route   PATCH /api/projects/:id/health
 * @desc    Update project health score and add risks/care actions
 * @access  Protected (should add auth middleware in production)
 */
router.patch('/:id/health', updateProjectHealth);

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete a project (soft delete)
 * @access  Protected (should add auth middleware in production)
 */
router.delete('/:id', deleteProject);

export default router;
