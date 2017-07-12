var express     = require('express');
var router      = express.Router();
var company     = require('../controllers/company.controller.js');
var passport    = require('passport');

router.get('/create', company.getCreate);
router.post('/create', company.postCreate);
router.post('/upload', company.postUpload);

router.get('/list', company.getCompanyList);
router.get('/profile/:id', company.getCompanyProfile);

router.get('/register/:id', company.getCompanyEmployeeForm);
router.post('/register', company.postCompanyEmployeeForm);

router.get('/review/:id', company.getReview);
router.post('/review/:id', company.postReview);

router.get('/employees/:idCompany', company.getCompanyEmployees);

router.get('/search', company.getSearch);
router.post('/search', company.postSearch);

router.get('/message/:id',company.getEmployeeMessages);
router.post('/message/:id',company.postEmployeeMessages);

router.get('/leaderBoard', company.getLeaderBoard);

module.exports = router;
