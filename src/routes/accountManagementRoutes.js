const express = require('express');
const router = express.Router();
const userController = require('../modules/user/userController')
const userService = require('../modules/user/userService')

router.get('/', async (req, res) => {

    try {
        const users = await userService.getAllUsers();

        if (res.locals.user) {
            return res.redirect('/');
        }
        res.render('accountManagement', {
            layout: 'main',
            users,
            title: 'account management',
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', userController.setBanOrUnban);

module.exports = router;