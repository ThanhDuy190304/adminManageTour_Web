// tourService.js
const tourModel = require('./tourModel');
const { format } = require('date-fns');

class TourService {
    static async getTours(page, query,sort, location, company) {
        try {
            return await tourModel.getTours(page, query,sort, location, company);
        } catch (err) {
            throw new Error(err.message);
        }
    }
    static async addTourId(title,brief,detail,location,price,rate,voucher) {
            console.log(title,brief,detail,location,price,rate,voucher)
        try {
            const touID = await tourModel.getNextID();
            console.log(touID,title,brief,detail,location,price,rate,voucher)
            await tourModel.addTourId(touID,title,brief,detail,location,price,rate,voucher);
        } catch (err) {
            throw new Error(err.message);
        }
    }
    static async UpdateTour(tourId, title,brief,detail,location,price,rate,voucher) {
        console.log(title,brief,detail,location,price,rate,voucher)
        try {
            await tourModel.UpdateTour(tourId, title,brief,detail,location,price,rate,voucher);
        } catch (err) {
            throw new Error(err.message);
        }
    }

    static async getTourByID(tour_id) {
        try {
            const tour = await tourModel.getTourByID(tour_id);
            tour.schedulesTour = tour.schedulesTour.map(schedule => {
                schedule.tour_date = format(new Date(schedule.tour_date), 'dd-MM-yyyy');
                return schedule;
            });
            return tour;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    static async getToursByIDLocation(tour_id) {
        try {
            return await tourModel.getToursByIDLocation(tour_id);
        } catch (err) {
            throw new Error(err.message);
        }
    }
}

module.exports = TourService;
