var express         = require('express');
var path            = require('path');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var passport        = require('passport');
var mongoose        = require('mongoose');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var ejs             = require('ejs');
var engine          = require('ejs-mate');
var session         = require('express-session');
var flash           = require('connect-flash');
var validator       = require('express-validator');
var MongoStore      = require('connect-mongo')(session);
var _               = require('underscore');
var moment          = require('moment');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/rateme');
mongoose.connection.once('open', () => {
    console.log("Mongo DB connection success");
}).on('error', (err) => {
    console.log("ERROR : Mongod DB connection failure!")
})

require('./config/passport');
var indexRoute          = require('./routes/index');
var userRoute           = require('./routes/users');
var companyRoute        = require('./routes/company');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', engine);


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'd3n13D_89*',   
  resave:false,
  saveUninitialized:false,
  store: new MongoStore({mongooseConnection:mongoose.connection}),
  // cookie: { maxAge: 180 * 60 * 1000 } // 3 hours
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use( (req, res, next) => {
    // set global variables
    if( req.session.cookie.originalMaxAge !== null || req.isAuthenticated() ) {
        res.locals.login = req.isAuthenticated();
    } else {
        res.locals.login = null;
    }
    res.locals._ = _;
    res.locals.moment = moment;
    next();
})




app.use('/user', userRoute);
app.use('/company', companyRoute);
app.use('/', indexRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
