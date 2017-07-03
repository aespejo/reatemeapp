var nodemailer      = require('nodemailer');
var smtpTransport   = require('nodemailer-smtp-transport');
var async           = require('async');
var crypto          = require('crypto');
var User            = require('../models/user.model.js')

var config          = require('../config/config.js');
var userController  = {};

userController.getSignin = function(req, res, next) {
    let errors = req.flash('errors');
    res.render('user/signin', {
        title :     'Signin - Rate Me',
        errors:     errors,
        hasErrors:  errors.length
    });
}

userController.getSignup = function(req, res, next) {
    let errors = req.flash('errors');
    res.render('user/signup', {
        title : 'Signup - Rate Me',
        errors:     errors,
        hasErrors:  errors.length
    });
}

userController.getHome = function(req, res, next) {
   res.render('user/home', {title : 'Home - Rate Me'});
}

userController.getForgot = function(req, res, next) {
    let errors  = req.flash('errors');
    let info    = req.flash('info');
    res.render('user/forgot', {
        title : 'Forgot Password - Rate Me',
        errors:     errors,
        hasErrors:  errors.length,
        info:       info,
        hasInfo:    info.length
    });
}

userController.postForgot = function(req, res, next) {
    async.waterfall([
        function(callback) {
            crypto.randomBytes(50, (err, buff) => {
                let rand = buff.toString('hex');
                callback(err, rand);
            });
        },
        function(rand, callback) {
            User.findOne({'email':req.body.email}, (err, user) => {
                if( !user ) {
                    req.flash('errors', 'Email address does not exist');
                    return res.redirect('/user/forgot');
                }

                user.passwordResetToken = rand;
                user.passwordResetExpires = Date.now() + 60*60*1000; // 1 hour 
                user.save((err) => {
                    console.log(err);
                    callback(err, rand, user);
                })
            })
        },
        function(rand, user, callback) {
            let smtpTranport = nodemailer.createTransport({
                service: 'gmail',
                // host: 'smtp.gmail.com',
                port: 25,
                secure: false,
                auth: {
                    user : config.smtpAuth.user,
                    pass : config.smtpAuth.pass,
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            let mailOptions = {
                from: 'RateMe <' + config.smtpAuth.user + '>', // sender address
                to: user.email, // list of receivers
                subject: 'RateMe Application password reset request', // Subject line
                text: `
                    You have requested for password reset token.
                    Please click on the link to complete the process: http://localhost:3000/user/reset/${rand}
                `,
            }

            smtpTranport.sendMail(mailOptions, (err, result) => {
                req.flash('info', 'A password reset link was sent to ' + user.email);
                return callback(err, user);
            })
        }
    ], ( err ) => {
        if( err ) return next(err);
        res.redirect('/user/forgot');
    });
}

userController.getReset = function(req,res, next) {

    User.findOne({
        passwordResetToken:     req.params.token,
        passwordResetExpires:   {$gt:Date.now()}
    }, (err, user) => {
        if( !user ) {
            req.flash('errors', 'Password reset token is already expired or invalid. Enter email again to resend a new link.');
            return res.redirect('/user/forgot');
        }

        let errors  = req.flash('errors');
        let success = req.flash('success');
        res.render('user/reset', {
            title:      'Password Reset : RateMe',
            errors:     errors,
            hasErrors:  errors.length,
            success: success,
            isSuccessfull: success.length
        });
    });
}

userController.postReset = function(req, res, next) {
    async.waterfall([
        function(callback) {
            User.findOne({passwordResetToken:req.params.token, passwordResetExpires: {$gt:Date.now()}}, (err, user) => {
                if( !user ) {
                    req.flash('errors', 'Password reset token is already expired or invalid. Enter email again to resend a new link.');
                    return res.redirect('/user/forgot');
                }

                req.checkBody('password', 'Password is required').notEmpty();
                req.checkBody('cpassword', 'Confirm password is required').notEmpty();

                let errs        = req.validationErrors();
                let messages    = [];

                if(req.body.password == req.body.cpassword) {
                    if( errs ) {
                        errs.foreach((err) => {
                            messages.push(err.msg);
                        });
                        req.flash('errors', messages);
                        res.redirect('/user/reset/'+req.params.token);
                    } else {
                        user.password               = user.encryptPassword(req.body.password);
                        user.passwordResetExpires   = '';
                        user.passwordResetToken     = '';

                        user.save((err) => {
                            req.flash('success', 'Your password has been updated successfully.');
                            callback(err, user);
                        });
                    }
                } else {
                    req.flash('errors', 'Password does not match');
                    res.redirect('/user/reset/'+req.params.token);
                }
            });
        }, 
        function(user, callback) {
            let smtpTranport = nodemailer.createTransport({
                service: 'gmail',
                // host: 'smtp.gmail.com',
                port: 25,
                secure: false,
                auth: {
                    user : config.smtpAuth.user,
                    pass : config.smtpAuth.pass,
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            let mailOptions = {
                from: 'RateMe <' + config.smtpAuth.user + '>', // sender address
                to: user.email, // list of receivers
                subject: 'Your password Has Been Updated.', // Subject line
                text: `This is a confirmation that you updated the password for ${user.email}`,
            }

            smtpTranport.sendMail(mailOptions, (err, result) => {
                callback(err, user);
                let errors  = req.flash('errors');
                let success = req.flash('success'); 
                res.render('user/reset', {
                    title:      'Password Reset : RateMe',
                    errors:         errors,
                    hasErrors:      errors.length,
                    success:        success,
                    isSuccessfull:  success.length
                })
            })
        }
    ], (err) => {
        if( err ) return next(err);
    });
}

userController.getLogout = function(req, res, next) {
    req.logout();
    req.session.destroy((err) => {
        res.redirect('/');
    });
    
}

module.exports = userController;
