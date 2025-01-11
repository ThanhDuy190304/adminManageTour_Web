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

router.get('/accountManagement', (req,res) =>{

    console.log('11');
    res.render('accountManagement',{
        layout: false,
        title: 'account management page',
    })

});

module.exports = router;