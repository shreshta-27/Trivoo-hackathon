import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import connectDB from './Config/db.js';
import passport, { configurePassport } from './Config/passport.js';
import userRoutes from './Routes/userRoutes.js';
import authRoutes from "./Routes/authRoutes.js";
import mapRoutes from './Routes/mapRoutes.js';
import projectRoutes from './Routes/projectRoutes.js';
import suitabilityRoutes from './Routes/suitabilityRoutes.js';
import lifecycleRoutes from './Routes/lifecycleRoutes.js';
import analyticsRoutes from './Routes/analyticsRoutes.js';
import actionRecommendationRoutes from './Routes/actionRecommendationRoutes.js';
import newsRoutes from './Routes/newsRoutes.js';
import cropRoutes from './Routes/cropRoutes.js';
import testRoutes from './Routes/testRoutes.js';
import chartRoutes from './Routes/chartRoutes.js';

dotenv.config();

connectDB();
configurePassport();

const app = express();

app.use(helmet());
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());

import { createServer } from 'http';
import { Server } from 'socket.io';
import plantingSocket from './sockets/plantingSocket.js';
import { seedTreeData } from './utils/seedTrees.js';
import plantingRoutes from './Routes/plantingRoutes.js';

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        credentials: true
    }
});

import futureRiskRoutes from './Routes/futureRiskRoutes.js';
import futurescapeRoutes from './Routes/futurescapeRoutes.js';
import { runRiskForecastJob } from './Controllers/riskForecastController.js';

// ... (previous code)

plantingSocket(io);
seedTreeData();

// Scheduler: Run Risk Forecast everyday (86400000 ms)
// For Hackathon demo: Run on startup then every hour
setTimeout(() => {
    runRiskForecastJob();
}, 10000); // Run 10s after startup
setInterval(() => {
    runRiskForecastJob();
}, 3600000); // 1 Hour

app.use('/api/users', userRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/map', mapRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/suitability', suitabilityRoutes);
app.use('/api/lifecycle', lifecycleRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/recommendations', actionRecommendationRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/planting', plantingRoutes);
app.use('/api/forecast', futureRiskRoutes);
app.use('/api/futurescape', futurescapeRoutes);
app.use('/api/test', testRoutes);
app.use('/api/charts', chartRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Trivo API is running' });
});

app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
