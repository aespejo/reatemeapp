var express = require('express');
var router = express.Router();
var Company = require('../models/company.model.js');


router.get('/', function(req, res, next) {
    let title           = '';
    Company.find({},(err, result) => {
        if(req.isAuthenticated) {
            title = 'Home || RateMe App';
        } else {
            title = 'Welcome to Rate Me App';
        }
        res.render('index', { title:title, user: req.user, data:result });
    });   
});


module.exports = router;
