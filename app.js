const createError  = require('http-errors');
const express      = require('express');
const path         = require('path');
const cookieParser = require('cookie-parser');
const logger       = require('morgan');
const mongoose     = require('mongoose');
const session      = require('express-session');
const MongoStore   = require('connect-mongo')(session);

const indexRouter   = require('./routes/index');
const usersRouter   = require('./routes/users');
const privateRouter = require('./routes/private');

const app = express();

// Connect to database
const app_name = require('./package.json').name;
mongoose.connect(`mongodb://localhost/${app_name}`, {
  keepAlive: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  reconnectTries: Number.MAX_VALUE
}).then(data => {console.log(`Connected to Mongo!: ${data.connections[0].name}`)
}).catch(errpr => {console.log(error)});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session handler
app.use(session({
  secret: app_name + "-secret",
  cookie: {maxAge: 60000},
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24*60*60
  })
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/private', privateRouter);

/* 404 and error handlers */

// NOTE: requires a views/not-found.ejs template
app.use((req, res, next) => {
  res.status(404);
  res.render('not-found');
});

// NOTE: requires a views/error.ejs template
app.use((err, req, res, next) => {
  // Always log the error
  console.error('Error: ', req.method, req.path, err);

  // Only render if the error ocurred before sending the response
  if (!res.headersSent) {
    res.status(500);
    res.render('error');
  }
});

module.exports = app;
