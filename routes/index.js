const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/User');

const saltRounds = 10;

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

// sign up
router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.redirect('/signup');
    return;
  }
  try {
    const validation = await User.findOne({ username });
    if (validation) {
      res.redirect('/signup');
      return;
    }
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = {
      username,
      password: hashedPassword
    };
    const createdUser = await User.create(newUser);
    req.session.currentUser = createdUser;
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

// log in
router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.redirect('/login');
    return;
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.redirect('/login');
      return;
    }
    if (bcrypt.compareSync(password /* provided password */, user.password/* hashed password */)) {
      // Save the login in the session!
      req.session.currentUser = user;
      res.redirect('/');
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
