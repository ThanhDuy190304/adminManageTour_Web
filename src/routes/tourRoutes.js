const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer(); // Sử dụng multer để xử lý multipart/form-data
const tourController = require('../modules/tour/tourController');

router.get('/api', tourController.getAllToursAPI);
// router.get('/:tour_id', tourController.renderTourByID);
// router.get('/', tourController.getAllTours);
// router.get('/api/getNumberOfTour', tourController.getNumberOfTour);
router.get('/getTourById/:tourId', tourController.getTourById);
router.post('/addTourId', upload.array('images[]'), tourController.addTourId);
router.put('/UpdateTour/:tourId',upload.array('images[]'), tourController.UpdateTour);
router.get('/', tourController.listAllTour);

module.exports = router;
