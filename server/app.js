const createError = require('http-errors');
const express = require('express');
const MsIdExpress = require('microsoft-identity-express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

require('dotenv').config();

const appSettings = require('./appSettings');
// const cache = require('./utils/cachePlugin');
// const router = require('./routes/router');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var msRouter = require('./routes/ms');

var app = express();
/**
 * Using express-session middleware for persistent user session
 */
 app.use(session({
  secret: process.env.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
      secure: false, // set this to true on deployment
  }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const msid = new MsIdExpress.WebAppAuthClientBuilder(appSettings).build();

app.use(msid.initialize()); // initialise default routes

app.use(msRouter(msid)); // use MsalWebAppAuthClient in routers downstream

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/ms', msRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = {app, msid};