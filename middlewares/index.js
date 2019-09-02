const bcrypt = require('bcrypt');
const User = require('../models/User');

const checkFields = (req, res, next) => {
  const { username, password } = req.body;

  if (username === '' || password === '') {
    req.flash('error', 'UserName and Password can\'t be empty!');
    res.redirect('/create');
  } else {
    next();
  }
};

const createUser = async (username, password) => {
  bcrypt.hash(password, 10, async (err, hash) => {
    return User.create({ username, hashedPassword: hash });
  });
};

const LogIn = async (username, password, req, res) => {
  const user = await User.findOne({ username });
  if (user) {
    if (bcrypt.compareSync(password, user.hashedPassword)) {
      req.session.currentUser = user;
      res.redirect('/users/admin');
    } else {
      req.flash('error', 'usuario o contraseña incorrectos');
      res.redirect('login');
    }
  } else {
    req.flash('error', 'usuario o contraseña incorrectos');
    res.redirect('login');
  }
};


const checkLoggin = (req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    req.flash('warning', 'Must be Logged to acces!');
    res.redirect('/login');
  }
};

const notifications = () => (req, res, next) => {
  res.locals.errorMessages = req.flash('error');
  res.locals.infoMessages = req.flash('info');
  res.locals.dangerMessages = req.flash('danger');
  res.locals.successMessages = req.flash('success');
  res.locals.warningMessages = req.flash('warning');
  next();
};

module.exports = {
  checkFields, createUser, notifications, checkLoggin, LogIn,
};
