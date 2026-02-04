

import rateLimit from 'express-rate-limit';

export const aiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    message: {
        success: false,
        message: 'Too many AI evaluation requests. Please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: 'Too many AI evaluation requests from this IP. Please try again in 15 minutes.',
            retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
        });
    }
});

export const generalRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

export const authenticatedRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Limit each IP to 50 AI requests per windowMs for authenticated users
    message: {
        success: false,
        message: 'Too many requests. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        return req.user && req.user.role === 'admin';
    }
});

export default {
    aiRateLimiter,
    generalRateLimiter,
    authenticatedRateLimiter
};
