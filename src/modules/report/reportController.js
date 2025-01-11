const reportService = require("./reportService");

class reportController {

    static async moneyStatisticByYear(req, res){
        try{
            const {sortByValue, orderValue} = req.params;
            const result = await reportService.moneyStatisticByYear(sortByValue, orderValue);
            res.status(200).json({
                success: true,
                venue: result,
            });
        }
        catch(error){
            console.log("Error in moneyStatisticByYear of reportController: ", error);
            res.status(500).json({
                success: false,
                message: 'Error in moneyStatisticByYear of reportController',
            });
        }
    }

    static async moneyStatisticByMonth(req, res){
        try{
            const {sortByValue, orderValue} = req.params;
            const result = await reportService.moneyStatisticByMonth(sortByValue, orderValue);
            res.status(200).json({
                success: true,
                venue: result,
            });
        }
        catch(error){
            console.log("Error in moneyStatisticByMonth of reportController: ", error);
            res.status(500).json({
                success: false,
                message: 'Error in moneyStatisticByMonth of reportController',
            });
        }
    }

    static async moneyStatisticByDay(req, res){
        try{
            const {sortByValue, orderValue} = req.params;
            const result = await reportService.moneyStatisticByDay(sortByValue, orderValue);
            res.status(200).json({
                success: true,
                venue: result,
            });
        }
        catch(error){
            console.log("Error in moneyStatisticByDay of reportController: ", error);
            res.status(500).json({
                success: false,
                message: 'Error in moneyStatisticByDay of reportController',
            });
        }
    }

}

module.exports = reportController;