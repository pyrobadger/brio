import rateLimit from 'express-rate-limit';

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: {
    success: false,
    message: 'Too many requests, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const createLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // More restrictive for write operations
  message: {
    success: false,
    message: 'Too many create requests, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
