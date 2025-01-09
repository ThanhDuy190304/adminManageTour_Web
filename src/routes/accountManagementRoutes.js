const express = require('express');
const router = express.Router();
const userController = require('../modules/user/userController')

router.get('/', (req,res) =>{

    const users = userController.getNumberOfUser();

    if(res.locals.user){
        return res.redirect('/');
    }
    res.render('accountManagement', {
        layout: 'main',
        title: 'account management',
    });
});

module.exports = router;