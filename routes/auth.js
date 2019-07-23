'use strict';

const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/User');

const { isLoggedIn, isNotLoggedIn, isFormFilled } = require('../middlewares/authMiddlewares');

const saltRounds = 10;
const router = express.Router();

router.get('/signup', isLoggedIn, (req, res, next) => {
  res.render('signup');
});

router.post('/signup', isLoggedIn, isFormFilled, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    /* encriptar password */
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    /* comprobamos que el usuario sea único */
    const user = await User.findOne({ username });
    if (user) {
      return res.redirect('/auth/signup');
    }
    /* */

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

router.get('/login', isLoggedIn, (req, res, next) => {
  res.render('login');
});

router.post('/login', isLoggedIn, isFormFilled, async (req, res, next) => {
  try {
    const { username, password } = req.body;

    req.session.currentUser = { username, password };
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

router.post('/logout', isNotLoggedIn, (req, res, next) => {
  delete req.session.currentUser; // delete elimina una key de un objeto
  res.redirect('/auth/login');
});

module.exports = router;
