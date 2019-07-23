'use strict';

const express = require('express');
const User = require('../models/User.js');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn, isFormFilled } = require('../middlewares/authMiddlewares.js');

const router = express.Router();
const saltRounds = 10;

router.get('/signup', isLoggedIn, (req, res, next) => {
  res.render('signup');
});

router.post('/signup', isLoggedIn, isFormFilled, async (req, res, next) => {
  const { username, password } = req.body;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);
  try {
    const user = await User.findOne({ username });
    if (user) {
      return res.redirect('/users/signup');
    }
    await User.create({
      username,
      password: hashedPassword
    });
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

router.get('/login', isLoggedIn, (req, res, next) => {
  res.render('login');
});

router.post('/login', isLoggedIn, isFormFilled, async (req, res, next) => {
  const { username, password } = req.body;
  console.log(req.body);
  try {
    const user = await User.findOne({ username });
    console.log(user);
    if (!user) {
      return res.redirect('/users/login');
    }
    if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      res.redirect('/');
    } else {
      res.redirect('/users/login');
    }
  } catch (error) {
    next(error);
  }
});

router.post('/logout', isNotLoggedIn, async (req, res, next) => {
  delete req.session.currentUser;
  res.redirect('/');
});

module.exports = router;
