import express from 'express';
import { manualTriggerForecast } from '../Controllers/riskForecastController.js';

const router = express.Router();

// Dev/Test route to trigger logic manually
router.post('/trigger', manualTriggerForecast);

export default router;
