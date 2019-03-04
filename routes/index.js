const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');

const User = require('../models/User');

router.get('/', (req, res, next) => {
  res.render('index');
});

// Bcrypt
const saltRounds = 10;

// Sing Up form
router.get('/auth/signup', (req, res, next) => {
  // Flash message
  const message = {
    messages: req.flash('FormValidation')
  };
  res.render('auth/signup', message);
});

router.post('/auth/signup', async (req, res, next) => {
  // Fields from form
  const { username, password } = req.body;
  // Check if password and username fields are empty
  if (!password || !username) {
    // Flash message
    req.flash('FormValidation', 'Username and Password required!');
    return res.redirect('/auth/signup');
  }
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
    req.session.currentUser = createUserWithHashedPassword; // **doubt**
    // Redirect at home
    return res.redirect('/');
  } catch (error) {
    next(error);
  }
});

// Login form
router.get('/auth/login', (req, res, next) => {
  const message = {
    messages: req.flash('FormValidation')
  };
  res.render('auth/login', message);
});

router.post('/auth/login', async (req, res, next) => {
  // Fields from form
  const { username, password } = req.body;
  // Check if password and username fields are empty
  if (!password || !username) {
    // Flash message
    req.flash('FormValidation', 'Username and Password required!');
    return res.redirect('/auth/login');
  }
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
      req.session.currentUser = userExist; // **doubt**
      res.redirect('/');
      console.log(`Login as ${userExist.username}`);
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
router.post('/auth/logout', (req, res, next) => {
  delete req.session.currentUser;
  res.redirect('/');
});

module.exports = router;
