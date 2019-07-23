'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const User = require('../models/User');

const router = express.Router(); // CO TO ROBI?

router.get('/signup', (req, res, next) => {
  res.render('signup.hbs');
});

router.post('/signup', async (req, res, next) => {
  const { username, password } = req.body;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);
  const newUser = await User.create({
    username,
    password: hashedPassword
  });
  req.session.currentUser = newUser;
  res.redirect('/');
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect('/');
      }
    }
    res.redirect('/auth/login');
  } catch (error) {
    next(error);
  }
});

router.post('/logout', (req, res, next) => {
  delete req.session.currentUser;
  res.redirect('/');
});

module.exports = router;
