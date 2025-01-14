const userModel = require("./userModel");
const reservationService = require("../reservation/reservationService")
const uploadService = require("../upload/uploadService")
// const { hashPassword, generateSalt } = require('../../utils/passwordUtils');
const { format } = require('date-fns');
const { ca } = require("date-fns/locale");

class userService {
    static async getNumberOfUser() {
        try {
            let numberUser = await userModel.getNumberOfUser();
            return numberUser;
        } catch (error) {
            console.log("Error getPublicProfile in userService: ", error.message);
            throw new Error("Error getPublicProfile in userService");
        }

    }

    static async getCountFilterUser(name_email) {
        try {
            let countUser = await userModel.getCountFilterUser(name_email);
            return countUser;
        } catch (error) {
            console.log("Error getCountFilterUser in userService: ", error.message);
            throw new Error("Error getCountFilterUser in userService");
        }
    }

    static async getAllUsers(sortBy, order, page) {
        try {
            let users = await userModel.getAllUsers(sortBy, order, page);
            return users;
        }
        catch (error) {
            console.log('Error in getAllUsers of userServices: ', error);
            throw new Error("Error in getAllUsers of userServices");
        }
    }

    static async filterUsers(name_email, sortBy, order, page) {
        try {
            let users = await userModel.filterUsers(name_email, sortBy, order, page);
            return users;
        }
        catch (error) {
            console.log('Error in filterUsers of userServices: ', error);
            throw new Error("Error in filterUsers of userServices");
        }
    }

    static async setBanOrUnban(user_id, isBanned) {
        try {
            let result = await userModel.setBanOrUnban(user_id, isBanned);
            return result;
        }
        catch (error) {
            console.log('Error in setBanOrUnban of userServices: ', error);
            throw new Error("Error in setBanOrUnban of userServices");
        }
    }

    static async getPublicProfile(userId) {
        try {
            let userProfile = await userModel.getProfileUser(userId);
            userProfile.birthdate = format(new Date(userProfile.birthdate), 'dd-MM-yyyy');
            return userProfile;
        } catch (error) {
            console.error("Error getPublicProfile in userService: ", error.message);
            throw new Error("Error getPublicProfile in userService");
        }

    }

    static async uploadProfilePicture(userId, fileBuffer, fileType) {
        console.log(1)
        try {
            const imageUrl = await uploadService.uploadProfilePicture(fileBuffer, fileType);
            await userModel.updateAvatar(userId, imageUrl);
            return imageUrl
        } catch (error) {
            console.error("Error checkEmailExists in userService: ", error.message);
            throw new Error("Error checkEmailExists in userService");
        }
    }

    static async updatePassword(userId, hashedPassword, salt) {
        try {
            await userModel.updatePassword(userId, hashedPassword, salt);
        } catch (error) {
            console.error("Error updatePassword in userService: ", error.message);
            throw new Error("Error updatePassword in userService");
        }
    }

    static async getAccount(userId) {
        try {
            let userAccount = await userModel.getAccount(userId);
            userAccount = {
                email: userAccount.email,
                userName: userAccount.userName,
            }
            return userAccount;
        } catch (error) {
            console.error("Error getAccount in userService: ", error.message);
            throw new Error("Error getAccount in userService");
        }
    }

    // static async changePassword(userId, oldPassword, newPassword) {
    //     try {
    //         const userAccount = await userModel.getAccount(userId);
    //         if (!userAccount) {
    //             return { success: false, message: 'User not found.' };
    //         }
    //         const { userPassword, salt } = userAccount;
    //         const isMatch = hashPassword(oldPassword, salt) === userPassword;
    //         if (!isMatch) {
    //             return { success: false, message: 'Current password is incorrect.' };
    //         }
    //         const newSalt = generateSalt();
    //         const hashedPassword = hashPassword(newPassword, newSalt);
    //         await userModel.updatePassword(userId, hashedPassword, newSalt);
    //         return { success: true, message: 'Change password successfully.' };
    //     } catch (error) {
    //         console.error("Error userService.changePassword: ", error.message);
    //         throw new Error("Error userService.changePassword");
    //     }
    // }

    static async updateProfile(userId, fullname, birthdate, contact, address) {
        try {

            await userModel.updateProfile(userId, fullname, birthdate, contact, address);

        } catch (error) {
            console.log("Error createFeedback in userService: ", error.message);
            throw new Error("Error createFeedback in userService");
        }
    }
}

module.exports = userService