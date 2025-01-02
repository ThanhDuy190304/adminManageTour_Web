const userModel = require("./userModel");
const reservationService = require("../reservation/reservationService")
const { format } = require('date-fns');

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
}

module.exports = userService