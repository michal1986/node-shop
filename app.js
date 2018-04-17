var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')

var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./config/database');
var api = require('./routes/api');
var app = express();

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var Airtable = require('airtable');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/books', express.static(path.join(__dirname, 'dist')));
app.use(cookieParser());

Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: 'key2rlTpmEcDJG0jE'
});
var base = Airtable.base('appt5j605NfW5vDOF');

app.use(session(
  {
    secret:'PctOLuIjcOXgbpOzjl61eqxioUpo8fwI',
    saveUninitialized: true,
    resave:true,
    store:new MongoStore({
     mongooseConnection:mongoose.connection
    }),
    cookie:{
      maxAge:200 * 60 * 1000
    }
  }
));

app.use(function(req, res, next) {
  res.locals.session = req.session;
  console.log(res.session);
  next();
});

app.use('/api', api);

app.use(passport.initialize());



mongoose.Promise = require('bluebird');
mongoose.connect(config.database, { promiseLibrary: require('bluebird') })
  .then(() =>  
  
   {
     console.log('connection succesful')

   }

  )
  .catch((err) => console.error(err));


// catch 404 and forward to error handler
app.use(function(req, res, next) {

  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
res.json({ error: err })
});

app.use('/api', api);

module.exports = app;

