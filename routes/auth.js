'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { isFormFilled, isLoggedIn, isNotLoggedIn } = require('../middlewares/authMiddlewares');

const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get('/signup', isLoggedIn, (req, res, next) => {
  res.render('signup');
});

router.post('/signup', isFormFilled, isLoggedIn, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const user = { username, password: hashedPassword };
    if (user) {
      res.redirect('/auth/signup');
    }
    await User.create(user);
    res.redirect('/auth/login');
  } catch (error) {
    next(error);
  }
});

router.get('/login', isLoggedIn, (req, res, next) => {
  res.render('login');
});

router.post('/login', isFormFilled, isLoggedIn, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (bcrypt.compareSync(password /* provided password */, user.password/* hashed password */)) {
      // Save the login in the session!
      req.session.currentUser = user;
      res.redirect('/');
    } else {
      res.redirect('/auth/login');
    }
  } catch (error) {
    next(error);
  }
});

router.post('/logout', isNotLoggedIn, (req, res, next) => {
  delete req.session.currentUser;
  res.redirect('/');
});

module.exports = router;
