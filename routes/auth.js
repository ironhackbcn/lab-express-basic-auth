const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const User = require('../models/User');

const { requireAnon, requireUser, requireFields } = require('../middlewares/auth');

const saltRounds = 10;

router.get('/signup', requireAnon, (req, res, next) => {
  const data = {
    messages: req.flash('validation')
  };
  res.render('auth/signup', data);
});

router.post('/signup', requireAnon, requireFields, async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const result = await User.findOne({ username });
    if (result) {
      req.flash('validation', 'This username is taken');
      res.redirect('signup');
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

router.get('/login', requireAnon, (req, res, next) => {
  const data = {
    messages: req.flash('validation')
  };
  res.render('auth/login', data);
});

router.get('/login', requireAnon, (req, res, next) => {
  res.render('auth/login');
});

router.post('/login', requireAnon, requireFields, async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const result = await User.findOne({ username });
    if (!result) {
      req.flash('validation', 'Wrong username or password');
      res.redirect('login');
      return;
    }
    if (bcrypt.compareSync(password, result.password)) {
      req.session.currentUser = result;
      res.redirect('/');
    } else {
      res.redirect('login');
    }
  } catch (error) {
    next(error);
  }
});

router.post('/logout', requireUser, async (req, res, next) => {
  delete req.session.currentUser;

  res.redirect('/');
});

module.exports = router;
