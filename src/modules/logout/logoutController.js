const logoutService = require('./logoutService');
require('dotenv').config();

class logoutController {
    static async logoutUser(req, res) {
        const user = res.locals.user;
        if (!user) {
            console.error("Error: Missing userId or deviceId in the request");
            return res.status(400).json({ message: 'An error occurred, please try again later.' });
        }
        try {
            await logoutService.deleteRefreshToken(user.userId, user.deviceId);
            const touristPath = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.TOURIST_PATH;
            res.clearCookie(process.env.ACCESS_TOKEN_NAME, { httpOnly: true, path: '/' });
            res.clearCookie(process.env.REFRESH_TOKEN_NAME, { httpOnly: true, path: '/' });
            return res.redirect(touristPath);
        } catch (error) {
            console.error('Logout error:', error); // Ghi lại lỗi cho mục đích debug
            return res.status(500).json({ message: 'There was an issue processing your logout request. Please try again later!' });
        }
    }
}
module.exports = logoutController;
