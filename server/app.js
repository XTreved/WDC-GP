const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const msal = require('@azure/msal-node');

require('dotenv').config();

// initialise express
var app = express();

// a temporary storage containiner for logged in users. Eventually implement with sqlite
app.locals.users = {};

// config object used for initialising msal app clients. See here for config options: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/configuration.md
const msalConfig = {
    auth: {
        clientId: process.env.CLIENT_ID,
        authority: process.env.OAUTH_AUTHORITY,
        clientSecret: process.env.CLIENT_SECRET,
        redirectUri: process.env.REDIRECT_URI,
        postLogoutRedirectUri: process.env.POST_LOGOUT_REDIRECT_URI,
    },
    system: {
        loggerOptions: {
          loggerCallback(loglevel, message, containsPii) {
            console.log(message);
          },
          piiLoggingEnabled: false,
          logLevel: msal.LogLevel.Verbose,
        }
    }
};

// generate the client which is used for authentication of all MS users in the app
app.locals.msalClient = new msal.ConfidentialClientApplication(msalConfig);

// session setup
app.use(session({
  secret: process.env.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  unset: 'destroy'
}));

// // Set up local vars for template layout
// app.use(function(req, res, next) {
//   // Check for an authenticated user and load
//   // into response locals
//   if (req.session.userId) {
//     res.locals.user = app.locals.users[req.session.userId];
//   }

//   next();
// });

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const graphRouter = require('./routes/graph');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug'); // NOTE: update from jade to pug

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter); // all msal authentication
app.use('/users', usersRouter);
app.use('graph', graphRouter);


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

module.exports = app;