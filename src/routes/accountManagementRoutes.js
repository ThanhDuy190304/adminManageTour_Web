const express = require('express');
const router = express.Router();
const userController = require('../modules/user/userController')

router.get('/', async (req, res) => {
    res.render('accountManagement', {
        layout: 'main',
        title: 'account management',
    });
});

router.get('/getAllUsers', userController.getAllUsers);
router.get('/getFilter/:name_email',userController.filterUsers);

router.post('/', userController.setBanOrUnban);

module.exports = router;