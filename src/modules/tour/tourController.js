// tourController.js
const tourService = require('./tourService');

class tourController {
    static async getAllToursAPI(req, res) {
        try {
            const {page, query = 'default',sort = 'default', location = ['default'], company = ['default']} = req.query;
            const allTours = await tourService.getTours(page, query,sort, location, company);
            res.json(allTours); // Trả về HTML
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    static async listAllTour(req, res) {
        try {
            const {page = 1, query = 'default',sort = 'default', location = ['default'], company = ['default']} = req.query;
            const allTours = await tourService.getTours(page, query,sort, location, company);
            res.render('tourManagement', {
                layout: 'main',
                location_name: 'Tour Management',
                allTours: allTours.paginatedTours,
                totalPages: allTours.totalPages,
                // loc_detail: `Here is a list of our top tours that we have carefully selected to bring you the best experiences. From journeys to explore pristine nature to cultural excursions rich in local identity, each tour is designed to meet the diverse interests and needs of visitors. With a team of professional guides and dedicated services, we are committed to bringing you a memorable and inspiring journey. Let's explore the most wonderful destinations through our attractive tours!`,
                title: 'Tours Page',
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    static async getTourById(req, res) {
        const { tourId } = req.params;
        try {
            const TourbyID = await tourService.getTourByID(tourId);
            res.json(TourbyID);
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
    static async addTourId(req, res) {
        const { title,brief,detail,location,price,rate,voucher} = req.body;
        try {
            await tourService.addTourId(title,brief,detail,location,price,rate,voucher);
            res.status(200).json({ success: true });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
    static async UpdateTour(req, res) {
        const { tourId } = req.params;
        const { title,brief,detail,location,price,rate,voucher} = req.body;
        try {
            await tourService.UpdateTour(tourId, title,brief,detail,location,price,rate,voucher);
            res.status(200).json({ success: true });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
    static async renderTourByID(req, res) {
        const { tour_id } = req.params;
        try {
            const [tour, related] = await Promise.all([
                tourService.getTourByID(tour_id),
                tourService.getToursByIDLocation(tour_id)
            ]);
            res.render('tour_detail', {
                layout: 'main',
                tour: tour,
                related,
                title: tour.brief,
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = tourController;
