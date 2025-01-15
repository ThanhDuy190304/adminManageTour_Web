const express = require('express');
const router = express.Router();
const locationController = require('../modules/location/locationController');

router.get('/', async (req, res) => {
    res.render('locationManagement', {
        layout: 'main',
        title: 'location management',
    });
});
router.get('/getAllLocations', locationController.getAllLocations);
router.post('/postLocation', locationController.postLocation);
router.patch('/patchLocation/:locationId', locationController.patchLocation);
router.delete('/deleteLocation/:locationId', locationController.deleteLocation);

module.exports = router;