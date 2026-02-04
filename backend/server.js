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

app.use('/api/users', userRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/map', mapRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/suitability', suitabilityRoutes);
app.use('/api/lifecycle', lifecycleRoutes);

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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
