var formidable      = require('formidable');
var path            = require('path');
var fs              = require('fs');
var Company         = require('../models/company.model.js');
var User            = require('../models/user.model.js');
var async           = require('async');

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
    let company         = new Company();
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
    let form = new formidable.IncomingForm();
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

companyController.getCompanyList = function(req, res, next) {
    Company.find({}, (err, data) => {
        res.render('company/list', {
            title:"Rate Me || Company List",
            user: req.user,
            data: data
        });
    });
}

companyController.getCompanyProfile = function (req, res, next) {
    Company.findOne({_id:req.params.id}, (err, data) => {
        if(err) throw err;
        res.render('company/profile', {
            title:"Rate Me || Company Profile",
            user: req.user,
            data: data,
            average:0
        });
    });
}

companyController.getCompanyEmployeeForm = function (req, res, next) {
    console.log(req.user._id);
    Company.findOne({_id:req.params.id}, (err, data) => {
        if(err) throw err;
        res.render('company/register-employee', {
            title:"Rate Me || Register Employee",
            user: req.user,
            data: data
        });
    });
}

companyController.postCompanyEmployeeForm = function (req, res, next) {
    async.parallel([
        function(callback) {
            Company.update(
                {
                    _id:                        req.body.idCompany,
                    'employees.employeeId':     {$ne:req.user._id}
                },
                {
                    $push: {employees:
                        {
                            employeeId:         req.user._id,
                            employeeFullname:   req.user.fullname,
                            employeeRole:       req.body.role
                        }
                    }
                }, (err, result) => {
                    callback(err, result);
                }
            );
        },
        function(callback) {
            async.waterfall([
                function(callback) {
                    Company.findOne({_id:req.body.idCompany}, (err, result) => {
                        callback(err, result);
                    });
                },
                function(result, callback) {
                    User.findOne({_id:req.user}, (err, data) => {
                        callback(err, data);
    
                        if(data.role == "") {
                            data.role           = req.body.role;
                            data.company.name   = result.name;
                            data.company.image  = result.image;

                            data.save((err) => {
                                if(err) callback(err,null);
                                req.flash('success', 'Successfully updated the record');
                            });
                        }
                        res.redirect('/company/register/'+req.body.idCompany);
                    })
                }
            ])
        }
    ], (err, result) => {
        if(err) {
            console.log('error');
            throw err
        }
    });
}

companyController.getSearch = function(req, res, next) {}
companyController.getLeaderBoard = function(req, res, next) {}

companyController.getReview = function(req, res, next) {
    let message = req.flash('success');
    Company.findOne({_id:req.params.id}, (err, data) => {
        res.render('company/review', {
            title:'Rate Me || Write company review',
            data:data,
            user: req.user,
            hasMsg:message.length,
            message:message
        });
    });
}

companyController.postReview = function(req, res, next) {
    
    async.waterfall([
        function(callback) {
            Company.findOne({_id:req.params.id},(err, result) => {
                callback(err, result);
            });
        },
        function(result, callback) {
            console.log(req.body);
            Company.update(
            {
                _id:req.params.id
            }, 
            {
                $push: 
                {
                    companyRating: 
                    {
                        companyName: req.body.sender,
                        userFullname: req.user.fullname,
                        userRole: req.user.role,
                        companyImage: req.user.company.image,
                        userRating: req.body.clickedValue,
                        userReview: req.body.review
                    },
                    ratingNumber: req.body.clickedValue
                },
                $inc: {ratingSum: parseInt(req.body.clickedValue)}
            }, (err) => {
                if(err) console.log('Error  ' , err );
                req.flash('success', 'Your review has been added.');
                res.redirect('/company/review/'+req.params.id);
            })
        }
    ]);
}

module.exports = companyController;