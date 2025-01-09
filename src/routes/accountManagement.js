const express = require('express');
const router = express.Router();

router.get('/', (req,res) =>{
    if(res.locals.user){
        return res.redirect('/');
    }
    res.render('accountManagement', {
        layout:false,
        title: 'account management',
    });
});

module.exports = router;