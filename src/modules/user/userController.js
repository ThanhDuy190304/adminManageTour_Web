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

    static async getCountFilterUser(req, res) {
        try {
            const name_email = req.params.name_email;
            let countUsers = await userService.getCountFilterUser(name_email);
            res.status(200).json({
                success: true,
                countUsers: countUsers,
            });
        }
        catch (error) {
            console.log("Error in getCountFilterUser of userController: ", error);
            res.status(500).json({
                success: false,
                message: 'Error in getCountFilterUser of userController',
            })
        }
    }

    static async getAllUsers(req, res) {
        try {
            const {sortBy, order, page} = req.params;
            let users = await userService.getAllUsers(sortBy, order, page);
            res.status(200).json({
                success: true,
                users: users,
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

    static async filterUsers(req, res) {
        try {
            const {name_email, sortBy, order, page} = req.params;
            let users = await userService.filterUsers(name_email, sortBy, order, page);
            res.status(200).json({
                success: true,
                users: users,
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
