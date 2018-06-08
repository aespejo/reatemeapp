var express     = require('express');
var router      = express.Router();
var company     = require('../controllers/company.controller.js');
var passport    = require('passport');

router.get('/create',isAuthenticated, company.getCreate);
router.post('/create',isAuthenticated, company.postCreate);
router.post('/upload',isAuthenticated, company.postUpload);

router.get('/list',isAuthenticated, company.getCompanyList);
router.get('/profile/:id', isAuthenticated, company.getCompanyProfile);

router.get('/register/:id',isAuthenticated, company.getCompanyEmployeeForm);
router.post('/register',isAuthenticated, company.postCompanyEmployeeForm);

router.get('/review/:id',isAuthenticated, company.getReview);
router.post('/review/:id',isAuthenticated, company.postReview);

router.get('/employees/:idCompany',isAuthenticated, company.getCompanyEmployees);

router.get('/search',isAuthenticated, company.getSearch);
router.post('/search',isAuthenticated, company.postSearch);

router.get('/message/:id',isAuthenticated,company.getEmployeeMessages);
router.post('/message/:id',isAuthenticated,company.postEmployeeMessages);

router.get('/leaderBoard',isAuthenticated,company.getLeaderBoard);


function isAuthenticated(req, res, next) {
    if(req.isAuthenticated()) return next();
    req.session.oldURL = '/company'+req.url;
    res.redirect('/user/signin');
}

module.exports = router;



test
