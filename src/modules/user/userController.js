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

    static async getAllUsers(req, res) {
        try {
            let users = await userService.getAllUsers();
            res.status(200).json({
                success: true,
                users,
            });
        }
        catch (error) {
            console.log("Error in getAllUsers of userController: ", error);
            res.status(500).json({
                success: false,
                message: 'Error in getAllUsers of userController',
            })
        }
    }

    static async filterUsers(name_email) {
        try {
            let users = await userService.filterUsers(name_email);
            res.status(200).json({
                success: true,
                users,
            })
        }
        catch (error) {
            console.log("Error in filterUsers of userController: ", error);
            res.status(500).json({
                success: false,
                message: 'Error in filterUsers of userController',
            })
        }
    }

    static async setBanOrUnban(req, res) {

        const { userId, isBanned } = req.body;

        try {
            const result = await userService.setBanOrUnban(userId, isBanned);
            if (result) {
                return res.status(200).json({
                    success: true,
                    message: 'User is banned/unbanned successfully',
                });
            }
            else {
                return res.status(404).json({
                    success: false,
                    message: 'User not found',
                });
            }
        } catch (error) {
            console.log("Error in banUser of userController: ", error);
            return res.status(500).json({
                success: false,
                message: 'Error in banUser of userController',
            });
        }
    }

}

module.exports = userController;
