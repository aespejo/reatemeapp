var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
    let title           = '';
    let isUserLoggedIn  = req.isAuthenticated();
    
    if( isUserLoggedIn ) {
        title = 'Home || RateMe App';
    } else {
        title = 'Welcome to Rate Me App';
    }
    console.log(req.isAuthenticated());
    res.render('index', { title: title, user: req.user });
});

module.exports = router;
