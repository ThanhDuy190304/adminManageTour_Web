const userModel = require("./userModel");
const reservationService = require("../reservation/reservationService")
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

    static async getAllUsers() {
        try {
            let users = await userModel.getAllUsers();
            return users;
        }
        catch (error) {
            console.log('Error in getAllUsers of userServices: ', error);
            throw new Error("Error in getAllUsers of userServices");
        }
    }

    static async filterUsers(name_email) {
        try {
            let users = await userModel.filterUsers(name_email);
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

}

module.exports = userService