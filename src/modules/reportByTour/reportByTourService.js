const reportByTourModel = require("./reportByTourModel");
const { format } = require('date-fns');
const { ca } = require("date-fns/locale");

class reportByTourService {

    static async getAllTitle() {
        try {
            const result = await reportByTourModel.getAllTitle();
            return result;
        }
        catch (error) {
            console.log('Error in getAllTitle of reportService: ', error);
            throw new Error("Error in getAllTitle of reportService");
        }
    }

    static async tourStatisticByYear(tour_name) {
        try {
            const result = await reportByTourModel.tourStatisticByYear(tour_name)
            return result;
        }
        catch (error) {
            console.log('Error in tourStatisticByYear of reportService: ', error);
            throw new Error("Error in tourStatisticByYear of reportService");
        }
    }

    static async tourStatisticByMonth(tour_name) {
        try {
            const result = await reportByTourModel.tourStatisticByMonth(tour_name)
            return result;
        }
        catch (error) {
            console.log('Error in tourStatisticByMonth of reportService: ', error);
            throw new Error("Error in tourStatisticByMonth of reportService");
        }
    }

    static async tourStatisticByDay(tour_name) {
        try {
            const result = await reportByTourModel.tourStatisticByDay(tour_name)
            return result;
        }
        catch (error) {
            console.log('Error in tourStatisticByDay of reportService: ', error);
            throw new Error("Error in tourStatisticByDay of reportService");
        }
    }

}

module.exports = reportByTourService;