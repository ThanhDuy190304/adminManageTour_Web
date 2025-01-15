const reportByTourService = require('./reportByTourService');

class reportByTourController {

    static async getAllTitle(req, res) {
        try {
            const result = await reportByTourService.getAllTitle();
            res.status(200).json({
                success: true,
                titles: result,
            });
        }
        catch (error) {
            console.log("Error in getAllTitle of reportController: ", error);
            res.status(500).json({
                success: false,
                message: 'Error in getAllTitle of reportController',
            });
        }
    }

    static async tourStatisticByYear(req, res) {
        try {
            const tour_name = req.params.tour_name;
            const result = await reportByTourService.tourStatisticByYear(tour_name);
            res.status(200).json({
                success: true,
                venue: result,
            });
        }
        catch (error) {
            console.log("Error in tourStatisticByYear of reportController: ", error);
            res.status(500).json({
                success: false,
                message: 'Error in tourStatisticByYear of reportController',
            });
        }
    }

    static async tourStatisticByMonth(req, res) {
        try {
            const tour_name = req.params.tour_name;
            console.log(tour_name);
            const result = await reportByTourService.tourStatisticByMonth(tour_name);
            res.status(200).json({
                success: true,
                venue: result,
            })
        }
        catch (error) {
            console.log("Error in tourStatisticByMonth of reportController: ", error);
            res.status(500).json({
                success: false,
                message: 'Error in tourStatisticByMonth of reportController',
            });
        }
    }

    static async tourStatisticByDay(req, res) {
        try {
            const tour_name = req.params.tour_name;
            const result = await reportByTourService.tourStatisticByDay(tour_name);
            res.status(200).json({
                success: true,
                venue: result,
            })
        }
        catch (error) {
            console.log("Error in tourStatisticByDay of reportController: ", error);
            res.status(500).json({
                success: false,
                message: 'Error in tourStatisticByDay of reportController',
            });
        }
    }

}

module.exports = reportByTourController;