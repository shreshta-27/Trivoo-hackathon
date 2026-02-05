import rateLimit from 'express-rate-limit';export const aiRateLimiter = rateLimit({    windowMs: 15 * 60 * 1000, 
    max: 10, 
    message: {        success: false,        message: 'Too many AI evaluation requests. Please try again later.',        retryAfter: '15 minutes'    },    standardHeaders: true, 
    legacyHeaders: false, 
    handler: (req, res) => {        res.status(429).json({            success: false,            message: 'Too many AI evaluation requests from this IP. Please try again in 15 minutes.',            retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)        });    }});export const generalRateLimiter = rateLimit({    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: {        success: false,        message: 'Too many requests. Please try again later.'    },    standardHeaders: true,    legacyHeaders: false});export const authenticatedRateLimiter = rateLimit({    windowMs: 15 * 60 * 1000, 
    max: 50, 
    message: {        success: false,        message: 'Too many requests. Please try again later.'    },    standardHeaders: true,    legacyHeaders: false,    skip: (req) => {        return req.user && req.user.role === 'admin';    }});export default {    aiRateLimiter,    generalRateLimiter,    authenticatedRateLimiter};