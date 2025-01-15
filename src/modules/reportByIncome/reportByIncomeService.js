const reportByIncomeModel = require("./reportByIncomeModel");
const { format } = require('date-fns');
const { ca } = require("date-fns/locale");

class reportByIncomeService {

    static async moneyStatisticByYear(sortByValue, orderValue) {
        try {
            const result = await reportByIncomeModel.moneyStatisticByYear(sortByValue, orderValue);
            return result;
        }
        catch (error) {
            console.log('Error in moneyStatisticByYear of reportService: ', error);
            throw new Error("Error in moneyStatisticByYear of reportService");
        }
    }

    static async moneyStatisticByMonth(sortByValue, orderValue){
        try{
            const result = await reportByIncomeModel.moneyStatisticByMonth(sortByValue, orderValue);
            return result;
        }
        catch(error){
            console.log('Error in moneyStatisticByMonth of reportService', error);
            throw new Error("Error in moneyStatisticByMonth of reportService");
        }
    }

    static async moneyStatisticByDay(sortByValue, orderValue){
        try{
            const result = await reportByIncomeModel.moneyStatisticByDay(sortByValue, orderValue);
            return result;
        }
        catch(error){
            console.log('Error in moneyStatisticByDay of reportService', error);
            throw new Error("Error in moneyStatisticByDay of reportService");
        }
    }

}

module.exports = reportByIncomeService;