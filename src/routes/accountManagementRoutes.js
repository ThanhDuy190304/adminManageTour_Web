const express = require('express');
const router = express.Router();
const userController = require('../modules/user/userController')

router.get('/', async (req, res) => {
    res.render('accountManagement', {
        layout: 'main',
        title: 'account management',
    });
});

//sortBy, order, page
router.get('/getNumberUsers', userController.getNumberOfUser);
router.get('/getCountFilterUsers/:name_email', userController.getCountFilterUser);
router.get('/getAllUsers/:sortBy/:order/:page', userController.getAllUsers);
router.get('/getFilter/:name_email/:sortBy/:order/:page',userController.filterUsers);

router.post('/', userController.setBanOrUnban);

module.exports = router;