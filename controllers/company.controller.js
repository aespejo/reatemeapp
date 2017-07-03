// var nodemailer      = require('nodemailer');
// var smtpTransport   = require('nodemailer-smtp-transport');
// var async           = require('async');
var formidable      = require('formidable');
var path            = require('path');
var fs              = require('fs');
var Company         = require('../models/company.model.js')

var companyController   = {};


companyController.getCreate = function(req, res, next) {
    let success = req.flash('success');
    res.render('company/create', {
        title: 'Register Company : Rate Me', 
        noErrors:success.length,
        user:req.user,
        success:success,
    });
}

companyController.postCreate = function(req, res, next) {
    let company = new Company();
    company.name        = req.body.name;
    company.address     = req.body.address;
    company.city        = req.body.city;
    company.country     = req.body.country;
    company.sector      = req.body.sector;
    company.website     = req.body.website;
    company.image       = req.body.upload;

    company.save((err) => {
        if( err ) throw err;
        console.log(company);
        req.flash('success', 'Record successfully created!');
        res.redirect('/company/create');
    });
}

companyController.postUpload = function(req, res, next) {
    var form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '../public/uploads');
    form.on('file', (field, file) => {
        fs.rename(file.path,path.join(form.uploadDir, file.name), (err) => {
            if( err ) throw err;
            console.log("File : success");
        })
    });

    form.on('error', (err) => {
        console.log('An error occured', err);
    })

    form.on('end', () => {
        console.log('File upload successful');
    });

    form.parse(req);
}

companyController.getCompanyList = function(req, res, next) {}
companyController.getSearch = function(req, res, next) {}
companyController.getLeaderBoard = function(req, res, next) {}

module.exports = companyController;