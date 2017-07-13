// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var express     = require('express');
var router      = express.Router();
var user        = require('../controllers/user.controller.js');
var passport    = require('passport');


router.get('/signin', user.getSignin);
router.post('/signin',signinValidation, passport.authenticate('local.signin', {
    failureRedirect: '/user/signin',
    failureFlash: true
}), (req, res, next) => {
    if(req.body.rememberme) {
        req.session.cookie.maxAge = 30*24*60*60*1000 // 30 days
    } else {
        req.session.cookie.expires = false;
    }

    if(req.session.oldURL) {
        var oldUrl = req.session.oldURL;
        req.session.oldURL = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/');
    }
    
});

router.get('/signup', user.getSignup);
router.post('/signup',signupValidation, passport.authenticate('local.signup', {
    successRedirect: '/',
    failureRedirect: '/user/signup',
    failureFlash: true
}));

router.get('/auth/facebook', passport.authenticate('facebook', {scope:['email']} ));
router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    // successRedirect:    '/',
    failureRedirect:    '/user/signin',
    failureFlash:       true
}), (req, res, next) => {
    console.log(req.session);
    if(req.session.oldURL) {
        var oldUrl = req.session.oldURL;
        req.session.oldURL = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/');
    }
});

router.get('/home', user.getHome);

router.get('/forgot', user.getForgot);
router.post('/forgot', user.postForgot);

router.get('/reset/:token', user.getReset);
router.post('/reset/:token', user.postReset);

router.get('/logout', user.getLogout);



function signupValidation(req, res, next) {
    req.checkBody('fullname', 'Name is required').notEmpty();
    req.checkBody('email', 'Email address is required').isEmail();
    req.checkBody('password', 'Password is required and must not be less than 5 characters').isLength({min:5});

    var errors = req.validationErrors();
    if( errors ) {
        var messages = [];
        errors.forEach((error) => {
            messages.push(error.msg);
        });
        req.flash('errors', messages);
        return res.redirect('/user/signup');
    }
    return next();
}

function signinValidation(req, res, next) {
    req.checkBody('email', 'Invalid email').isEmail();
    req.checkBody('password', 'Invalid password').isLength({min:5});

    var errors = req.validationErrors();
    if( errors ) {
        var messages = [];
        errors.forEach((error) => {
            messages.push(error.msg);
        });
        req.flash('errors', messages);
        return res.redirect('/user/signin');
    }
    return next();
}

module.exports = router;

 