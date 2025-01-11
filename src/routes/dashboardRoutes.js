const express = require('express');
const router = express.Router();

router.get('/',(req,res) =>{
    
    if(res.locals.user){
        return res.redirect('/');
    }
    res.render('dashboard',{
        layout: false,
        title: 'dashboard',
    });

});

module.exports = router;