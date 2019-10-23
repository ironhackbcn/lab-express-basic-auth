const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session    = require("express-session");
const MongoStore = require("connect-mongo")(session);


const indexRouter = require('./routes/index');

const app = express();

mongoose.connect('mongodb://localhost/basic-auth', {
  keepAlive: true,
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE
});
//justo despues de conexion con mongoose poner el middleware de session sino no funciona
// secret: Used to sign the session ID cookie (required)
// cookie: Object for the session ID cookie. In this case, we only set the maxAge attribute, which configures the expiration date of the cookie (in milliseconds).
// store: Sets the session store instance. In this case, we create a new instance of connect-mongo, so we can store the session information in our Mongo database.

app.use(session({
  secret: "basic-auth-secret",
  cookie: { maxAge: 60000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

const usersRouter = require("./routes/site-routes")
app.use('/user', usersRouter);



// -- 404 and error handler

// NOTE: requires a views/not-found.ejs template
app.use((req, res, next) => {
  res.status(404);
  res.render('not-found');
});

// NOTE: requires a views/error.ejs template
app.use((err, req, res, next) => {
  // always log the error
  console.error('ERROR', req.method, req.path, err);

  // only render if the error ocurred before sending the response
  if (!res.headersSent) {
    res.status(500);
    res.render('error');
  }
});

module.exports = app;
