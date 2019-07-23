'use strict';

const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/User.js');
const { isLoggedIn, isNotLoggedIn, isFormFilled } = require('../middleware/authMiddleware');

const saltRounds = 10;
const router = express.Router();

router.get('/signup', isLoggedIn, (req, res, next) => {
  res.render('signup');
});

router.post('/signup', isLoggedIn, isFormFilled, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = await User.findOne({ username });
    if (user) {
      return res.redirect('/auth/signup');
    }

    const newUser = await User.create({
      username,
      password: hashedPassword
    });

    req.session.currentUser = newUser;
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

/* GET home page. */
router.get('/login', isLoggedIn, (req, res, next) => {
  res.render('login');
});

/* POST home page. */
router.post('/login', isLoggedIn, isFormFilled, async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.redirect('/auth/login');
    }

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

/* POST home page. */
router.post('/logout', isNotLoggedIn, (req, res, next) => {
  delete req.session.currentUser;
  res.redirect('/auth/login/');
});

module.exports = router;
