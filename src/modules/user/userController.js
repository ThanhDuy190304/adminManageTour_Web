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

    static async getUserProfile(req, res) {
        try {
            const user = res.locals.user;
            let userProfile = await userService.getPublicProfile(user.userId);
            res.status(200).json({
                success: true,
                userProfile: userProfile,
            });
        } catch (error) {
            console.error("Error in getUserProfile:", error);
            res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            });
        }
    }

    static async getAccount(req, res) {
        const user = res.locals.user;
        try {
            const userAccount = await userService.getAccount(user.userId);
            if (!userAccount) {
                return res.status(404).json({
                    message: 'User not found.'
                });
            }
            res.status(200).json({
                userAccount: userAccount,
            });
        } catch (error) {
            console.error("Error in user.getAccount:", error);
            res.status(500).json({
                message: 'Have an error. Please try again later.'
            });
        }
    }

    static async uploadProfilePicture(req, res) {
        try {
                // Kiểm tra xem file đã được tải lên chưa
            if (!req.file) {
                return res.status(400).send({ error: 'Không có file ảnh trong request' });
            }

            const file = req.file;
            const fileBuffer = file.buffer; // Dữ liệu ảnh dưới dạng buffer
            const fileType = file.mimetype; // MIME type của file
    
            // Lưu URL vào database (cập nhật profile của người dùng)
            const user = res.locals.user;
            if (!user) {
                return res.status(401).send();
            }
            const imageUrl = await userService.uploadProfilePicture(user.userId, fileBuffer, fileType);
    
            // Trả URL ảnh cho frontend
            res.send({ url: imageUrl });
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: error.message });
        }
    }

    static async changePassword(req, res) {
        try {
            const user = res.locals.user;
            let { currentPassword, newPassword } = req.body;
            if (!currentPassword || !newPassword) {
                return res.status(400).json({ message: 'Please provide both current and new password.' });
            }
            currentPassword = currentPassword.trim();
            newPassword = newPassword.trim();
            if (currentPassword === newPassword) {
                return res.status(400).json({
                    message: 'New password must be different from the current password.'
                });
            }
            const checkValidPassword = validatePassword(newPassword);
            if (!checkValidPassword.valid) {
                return res.status(400).json({
                    message: checkValidPassword.message
                });
            }
            const { success, message } = await userService.changePassword(user.userId, currentPassword, newPassword);
            if (!success) {
                return res.status(400).json({
                    message: message
                });
            }
            return res.status(204).send();
        } catch (error) {
            console.error("Error in changePassword:", error);
            res.status(500).json({
                message: 'Have an error. Please try again later.'
            });
        }
    }

    static async updateProfile(req, res) {
        const user = res.locals.user;
        if (!user) {
            return res.status(401).send();
        }
        const { fullname, birthdate, contact, address } = req.body;
        try {
            await userService.updateProfile(user.userId, fullname, birthdate, contact, address);
            return res.status(200).json({ success: true });
        } catch (error) {
            console.error("Error in updateProfile:", error);
            res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            });
        }
    }

}

module.exports = userController;
