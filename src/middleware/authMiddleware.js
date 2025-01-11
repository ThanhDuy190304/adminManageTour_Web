const jwt = require('jsonwebtoken');
const { refreshAccessToken } = require('../modules/auth/authController');
require('dotenv').config();

async function authenticateToken(req, res, next) {
    const accessToken = req.cookies[process.env.ACCESS_TOKEN_NAME];
    const refreshToken = req.cookies[process.env.REFRESH_TOKEN_NAME];
    if (accessToken) {
        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            res.locals.user = decoded;
            return next();
        } catch (err) {
            console.log('Access token expired, trying to refresh:', err.message);
            if (refreshToken) {
                try {
                    await refreshAccessToken(req, res, next);
                    return;
                } catch (refreshErr) {
                    console.log("Error refreshing token:", refreshErr.message);
                }
            }
            res.locals.user = null;
            res.clearCookie(process.env.ACCESS_TOKEN_NAME, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
            });
        }
    }
    if (!res.locals.user && refreshToken) {
        try {
            await refreshAccessToken(req, res, next);
            return;
        } catch (refreshErr) {
            console.log("Error refreshing token:", refreshErr.message);
        }
    }
    res.locals.user = null;
    return next();
}

function requireAdmin(req, res, next) {
    if (res.locals.user && res.locals.user.userRole === 1) {
        return next();
    }
    const touristPath = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.TOURIST_PATH;
    return res.redirect(touristPath);
}

module.exports = { authenticateToken, requireAdmin };