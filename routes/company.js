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
router.get('/search', company.getSearch);
router.get('/leaderBoard', company.getLeaderBoard);

module.exports = router;
