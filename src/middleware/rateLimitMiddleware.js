// middleware/rateLimitMiddleware.js
const rateLimit = require('express-rate-limit');

// Middleware giới hạn số yêu cầu
const rateLimitMiddleware = rateLimit({
    windowMs: 60 * 1000, // 1 phút
    max: 5, // Cho phép 5 yêu cầu trong 15 phút
    message: {
        message: "Too many requests from this IP, please try again after 5 minutes"
    },
    headers: true, // Hiển thị header 'X-RateLimit-*'
});

module.exports = rateLimitMiddleware;
