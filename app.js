'use strict';

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
/* requires para implementar cookies y sessions */
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
/* */

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');

const app = express();

mongoose.connect('mongodb://localhost/basic-auth', {
  keepAlive: true,
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE
});

// check si hay cookies en la request y si no hay la añade
app.use(session({
  store: new MongoStore({ // guarda la sesión
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  }),
  secret: 'some-string', // esto no se tiene k subir a githab, tiene que ser secreto
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true, // restringe el acceso a la cookie solo al http. Sin esto, podríams acceder desde Js, y sería más vulnerable.
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));
//

app.use((req, res, next) => {
  app.locals.currentUser = req.session.currentUser;
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);

// -- 404 and error handler
app.use((req, res, next) => {
  res.status(404);
  res.render('not-found');
});
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
