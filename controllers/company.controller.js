// var nodemailer      = require('nodemailer');
// var smtpTransport   = require('nodemailer-smtp-transport');
// var async           = require('async');
// var crypto          = require('crypto');
var User            = require('../models/company.model.js')

var companyController   = {};


companyController.getCompanyCreate = function(req, res, next) {
    res.render('company/create', {
        title: 'Register Company : Rate Me', 
        noErrors:false, 
        user:req.user
    });
}

companyController.getCompanyList = function(req, res, next) {}
companyController.getSearch = function(req, res, next) {}
companyController.getLeaderBoard = function(req, res, next) {}

module.exports = companyController;