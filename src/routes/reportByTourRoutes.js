const express = require('express');
const router = express.Router();
const reportByTourController = require('../modules/reportByTour/reportByTourController')

router.get('/', async (req, res) => {
    res.render('reportByTour',{
        layout: 'main',
        title: 'reportByTour',
    })
});

router.get('/getAllTitle', reportByTourController.getAllTitle);
router.get('/tourStatisticByYear/:tour_name', reportByTourController.tourStatisticByYear);
router.get('/tourStatisticByMonth/:tour_name', reportByTourController.tourStatisticByMonth);
router.get('/tourStatisticByDay/:tour_name', reportByTourController.tourStatisticByDay);

module.exports = router;