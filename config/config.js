module.exports = {
    db : {
        url:'mongodb://localhost:27017/rateme',
        username:'mugz_bugz',
        password:'th!s1$@S3(RetPa$$w0Rd'
    },
    smtpAuth : {
        user:'espejo.a2@gmail.com',
        pass:'r3v!s!0n_89*',
    },
    facebook : {
        clientID:           405990939747492,
        clientSecret:       'daf4288ec190ce655964a4b104f6e655',
        profileFields:      ['id', 'displayName', 'email', 'name'],
        callbackURL:        'http://localhost:3000/user/auth/facebook/callback',
        passReqToCallback:  true,
    }
}