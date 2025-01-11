const reportModel = require("./reportModel");
const { format } = require('date-fns');
const { ca } = require("date-fns/locale");

class reportService {

    static async moneyStatisticByYear(sortByValue, orderValue) {
        try {
            const result = await reportModel.moneyStatisticByYear(sortByValue, orderValue);
            return result;
        }
        catch (error) {
            console.log('Error in moneyStatisticByYear of reportService: ', error);
            throw new Error("Error in moneyStatisticByYear of reportService");
        }
    }

    static async moneyStatisticByMonth(sortByValue, orderValue){
        try{
            const result = await reportModel.moneyStatisticByMonth(sortByValue, orderValue);
            return result;
        }
        catch(error){
            console.log('Error in moneyStatisticByMonth of reportService', error);
            throw new Error("Error in moneyStatisticByMonth of reportService");
        }
    }

    static async moneyStatisticByDay(sortByValue, orderValue){
        try{
            const result = await reportModel.moneyStatisticByDay(sortByValue, orderValue);
            return result;
        }
        catch(error){
            console.log('Error in moneyStatisticByDay of reportService', error);
            throw new Error("Error in moneyStatisticByDay of reportService");
        }
    }

}

module.exports = reportService;