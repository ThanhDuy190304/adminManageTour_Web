const express = require('express');
const router = express.Router();
const tourModel = require('../modules/tour/tourModel');
const userModel = require('../modules/user/userModel');
const reserveModel = require('../modules/reservation/reservationModel');

//Route connect Home Page
router.get('/', async (req, res) => {
    try {
        const numberUser = await userModel.getNumberOfUser();
        const numberTour = await tourModel.getNumberOfTour();
        const bestTour = await tourModel.getBestrateTours();
        const numberReservation = await reserveModel.getNumberOfReserve();
        res.render('dashboard', {
            layout: 'main',
            numberUser,
            numberTour,
            bestTour,
            numberReservation,
            title: 'Home Page',
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/accountManagement', (req,res) =>{
    res.render('accountManagement',{
        layout: 'main',
        title: 'Account Manage',
    });
});



module.exports = router;