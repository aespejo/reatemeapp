var passport            = require('passport');
var LocalStrategy       = require('passport-local').Strategy;
var FacebookStrategy    = require('passport-facebook').Strategy;

var User                = require('../models/user.model.js');
var config              = require('./config.js');


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(function(idUser, done) {
    User.findById(idUser)
        .then(function(user) {
            done(null, user);
        })
        .catch(function(err) {
            return done(err);
        })
});

passport.use('local.signup', new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback: true }, 
    (req, email, password, done) => {
        
        User.findOne({'email':email}, (err, user) => {
            if(err) {
                return done(err); // db error
            }
            if(user) {
                return done(null, false, req.flash('errors', 'Email address already exist'));
            }

            var newUser         = new User();
            newUser.fullname    = req.body.fullname;
            newUser.email       = req.body.email;
            newUser.password    = newUser.encryptPassword( req.body.password );
            
            newUser.save()
                .then(() => {
                    done(null, newUser);
                })
                .catch(err => {
                    return done(err);
                });
        })
    }
));

passport.use('local.signin', new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback: true }, 
    (req, email, password, done) => {
         User.findOne({'email':email})
            .then( (user) => {
                var messages = [];
                if( !user ) {
                    messages.push('Invalid email address or password');
                    return done(null, false, req.flash('errors', messages));
                }

                // need checking if the password field is existing 
                // since were not storing the password in case of fb signup
                if( !user.password ) { 
                    messages.push('Invalid email address or password');
                    return done(null, false, req.flash('errors', messages));
                }

                if( !user.comparePassword(password) ) {
                    messages.push('Invalid email address or password');
                    return done(null, false, req.flash('errors', messages));
                }

                return done(null, user);
            })
            .catch((err) => {
                return done(err);
            })
    }
))

passport.use(new FacebookStrategy(config.facebook,
    (request, accessToken, refreshToken, profile, cb) => { 
        User.findOne({ facebook: profile.id }, (err, user) => {
            if( err ) return cb(err);
            if( !user ) {
                let newUser = new User();
                newUser.facebook = profile.id;
                newUser.fullname = profile.displayName;
                newUser.email    = profile._json.email;
                newUser.tokens.push({token:accessToken});
                newUser.save((err) => {
                    if( err ) return cb(err);
                    return cb(null, newUser);
                });
            } else { // user is already registered in our DB
                return cb(null, user);
            }  
        });
    }
));