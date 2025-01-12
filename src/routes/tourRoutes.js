const express = require('express');
const router = express.Router();
const tourController = require('../modules/tour/tourController');

router.get('/api', tourController.getAllToursAPI);
// router.get('/:tour_id', tourController.renderTourByID);
// router.get('/', tourController.getAllTours);
// router.get('/api/getNumberOfTour', tourController.getNumberOfTour);
router.get('/getTourById/:tourId', tourController.getTourById);
router.post('/addTourId', tourController.addTourId);
router.put('/UpdateTour/:tourId', tourController.UpdateTour);
router.get('/', tourController.listAllTour);

module.exports = router;
