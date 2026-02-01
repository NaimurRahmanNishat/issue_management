// src/middleware/rateLimiter.ts
import rateLimit from "express-rate-limit";


/* ====================== API LIMITER MIDDLEWARE ====================== */
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
});


/* ====================== AUTH LIMITER MIDDLEWARE ====================== */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5, // Limit login attempts
    message: "Too many login attempts, please try again later.",
    skipSuccessfulRequests: true,
});