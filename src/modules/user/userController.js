const userService = require("./userService");

class userController {

    static async getNumberOfUser(req, res) {
        try {

            let numberUser = await userService.getNumberOfUser();
            res.status(200).json({
                success: true,
                numberUser,
            });
        } catch (error) {
            console.error("Error in getUserProfile:", error);
            res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            });
        }
    }
}

module.exports = userController;
