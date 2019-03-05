const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');

const User = require('../models/User');

const { requireAnonymus, requireLogin, requireFields } = require('../middlewares/auth'); // **doubt**

// const requireAnon = require('../middlewares/auth');

router.get('/', (req, res, next) => {
  res.render('index');
});

// Bcrypt
const saltRounds = 10;

// Sing Up form
router.get('/auth/signup', requireAnonymus, (req, res, next) => {
  // Flash message
  const message = {
    messages: req.flash('FormValidation')
  };
  res.render('auth/signup', message);
});

router.post('/auth/signup', requireAnonymus, requireFields, async (req, res, next) => {
  // Fields from form
  const { username, password } = req.body;
  try {
    // Check if user exist
    const userExist = await User.findOne({ username });
    if (userExist) {
      // Flash message
      req.flash('FormValidation', 'This username is taken. Try another username.');
      return res.redirect('/auth/signup');
    }
    // Bcrypt
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    // User width hashed password
    const userWithHashedPassword = { username, password: hashedPassword };
    // Insert user with hashed password
    const createUserWithHashedPassword = await User.create(userWithHashedPassword);
    // Save user 'createUserWithHashedPassword' in server sesion
    req.session.currentUser = createUserWithHashedPassword;
    // Redirect at home
    return res.redirect('/');
  } catch (error) {
    next(error);
  }
});

// Login form
router.get('/auth/login', requireAnonymus, (req, res, next) => {
  const message = {
    messages: req.flash('FormValidation')
  };
  res.render('auth/login', message);
});

router.post('/auth/login', requireAnonymus, requireFields, async (req, res, next) => {
  // Fields from form
  const { username, password } = req.body;
  try {
    // Check if user exist
    const userExist = await User.findOne({ username });
    if (!userExist) {
      // Flash message
      req.flash('FormValidation', 'This username does not exists!');
      return res.redirect('/auth/login');
    }
    // Check if the password is the same between: form password VS user password in DB
    if (bcrypt.compareSync(password, userExist.password)) {
      // Save the user 'userExist' in the server session
      req.session.currentUser = userExist;
      res.redirect('/');
    } else {
      // Flash message
      req.flash('FormValidation', 'Password incorrect');
      res.redirect('/auth/login');
    }
  } catch (error) {
    next(error);
  }
});

// Logout
router.post('/auth/logout', requireLogin, (req, res, next) => {
  delete req.session.currentUser;
  res.redirect('/');
});

// Protected Route
router.get('/main', (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/auth/private');
  }
  return res.redirect('/');
});

// Protected Route
router.get('/private', (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/auth/private');
  }
  return res.redirect('/');
});

router.get('/auth/private', (req, res, next) => {
  res.render('auth/private');
});

module.exports = router;
