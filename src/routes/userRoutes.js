const express = require('express');
const userController = require('../modules/user/userController');
const multer = require('multer');
const upload = multer(); // Config cho multer
const router = express.Router();

router.get('/', (req, res) => {
    res.render('profile', {
        layout: 'main',
        title: 'Profile page',
    });
});
router.put('/updateProfile', userController.updateProfile);
router.get('/api/getProfile', userController.getUserProfile);
router.get('/api/getAccount', userController.getAccount);
router.post('/api/changePassword', userController.changePassword);
router.post('/uploadProfilePicture', upload.single('profilePicture'),userController.uploadProfilePicture);
router.get('/api/getNumberOfUser', userController.getNumberOfUser);
module.exports = router;
