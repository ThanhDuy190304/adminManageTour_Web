const express = require('express');
const router = express.Router();
const orderManagementController = require('../modules/orderManagement/orderManagementController');
const rateLimitMiddleware = require('../middleware/rateLimitMiddleware');

router.get('/', (req, res) => {
    res.render('orderManagement', {
        title: 'orderManagement',
    });
});
router.get('/getReservations', orderManagementController.getReservations);
router.post('/updateReservationStatus', rateLimitMiddleware, orderManagementController.updateReservationStatus);
router.get('/getDetailReservation/:reservationId', orderManagementController.getDetailReservation);
module.exports = router;