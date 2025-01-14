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
    static async addTourId(title, brief, detail, location, price, rate, voucher, uploadedUrls, detailed) {
        detailed=JSON.parse(detailed); 
        try {
            const touID = await tourModel.getNextID();
            await tourModel.addTourId(touID,title,brief,detail,location,price,rate,voucher);
            uploadedUrls.forEach(async (uploadedUrl, index) => {
                await tourModel.addImageTour(touID,uploadedUrl, index);
            });
            detailed.forEach(async (detail_tour) => {
                console.log(detail_tour); // Kiểm tra thông tin từng đối tượng
                await tourModel.addDetailedTour(touID, detail_tour.date, detail_tour.status, detail_tour.maxQuantity);
            });
        } catch (err) {
            throw new Error(err.message);
        }
    }
    static async UpdateTour(tourId, title, brief, detail, location, price, rate, voucher, uploadedUrls, detailed) {
        try {
            detailed=JSON.parse(detailed); 
            await tourModel.UpdateTour(tourId, title,brief,detail,location,price,rate,voucher);
            
            await tourModel.deleteImageTour(tourId)
            uploadedUrls.forEach(async (uploadedUrl, index) => {
                await tourModel.addImageTour(tourId,uploadedUrl, index);
            });
            detailed.forEach(async (detail_tour) => {
                console.log(detail_tour); // Kiểm tra thông tin từng đối tượng
                await tourModel.updateDetailedTour(tourId, detail_tour.detail_tour_id, detail_tour.date, detail_tour.status, detail_tour.maxQuantity);
            });
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
