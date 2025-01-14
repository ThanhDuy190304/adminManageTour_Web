// tourController.js
const tourService = require('./tourService');
const uploadService = require("../upload/uploadService")

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
        try {
            const { title, brief, detail, location, price, rate, voucher,details } = req.body;
            const files = req.files;  // Multer sẽ xử lý và lấy files
            if (!files || files.length === 0) {
                return res.status(400).json({ error: 'No files uploaded' });
            }
    
            const uploadedUrls = [];
    
            // Duyệt qua từng file và upload
            for (const file of files) {
                const fileBuffer = file.buffer;  // Dữ liệu file dưới dạng buffer
                const fileType = file.mimetype;  // MIME type của file
    
                // Giả sử bạn có một hàm upload lên Supabase hoặc bất kỳ dịch vụ nào
                const fileUrl = await uploadService.uploadProfilePicture(fileBuffer, fileType);
    
                uploadedUrls.push(fileUrl);  // Thêm URL của file vào mảng
            }
            await tourService.addTourId(title, brief, detail, location, price, rate, voucher, uploadedUrls, details);
    
            return res.status(200).json({ success: true, message: 'Tour added successfully'});
    
        } catch (err) {
            console.error('Error while adding tour:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    
    }
    static async UpdateTour(req, res) {
        const { tourId } = req.params;
        const { title, brief, detail, location, price, rate, voucher,details,newImages } = req.body;
        try {
            const files = req.files;  // Multer sẽ xử lý và lấy files
    
            const uploadedUrls = [];
    
            // Duyệt qua từng file và upload
            for (const file of files) {
                const fileBuffer = file.buffer;  // Dữ liệu file dưới dạng buffer
                const fileType = file.mimetype;  // MIME type của file
    
                // Giả sử bạn có một hàm upload lên Supabase hoặc bất kỳ dịch vụ nào
                const fileUrl = await uploadService.uploadProfilePicture(fileBuffer, fileType);
    
                uploadedUrls.push(fileUrl);  // Thêm URL của file vào mảng
            }
            // Gom mảng uploadedUrls và newImages lại thành một mảng duy nhất
            const allImages = uploadedUrls.concat(newImages || []);  // Nếu newImages không có thì sẽ là mảng rỗng
            await tourService.UpdateTour(tourId, title, brief, detail, location, price, rate, voucher, allImages, details);
            
            return res.status(200).json({ success: true, message: 'Tour added successfully'});
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
