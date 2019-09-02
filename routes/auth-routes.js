/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const express = require('express');

const router = express.Router();

const bcrypt = require('bcryptjs');

const saltRounds = 10;

const User = require('../models/user');

const { isUserLoggedIn, isNotFFilled } = require('../MiddleWares/authMiddleWares');

router.get('/login', (req, res, next) => {
  console.log("I'm in login");
  res.render('auth/login');
});

router.get('/signup', (req, res, next) => {
  console.log('load sign up form');
  res.render('auth/signup');
});

router.post('/login', async (req, res, next) => {
  console.log('I enter in the login form');
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  try {
    if (user) {
      console.log('user exist i will try now with the password');
      if (bcrypt.compareSync(password, user.hashedPassword)) {
        console.log('all is correct');
        req.session.currentUser = user;
        res.redirect('/private');
      } else {
        /* Invalid Password */
        console.log('invalid password');
        req.flash('error', 'User Name or Password incorrect!!!');
        res.render('auth/login');
      }
    } else {
      console.log('I load de login web again and send a error message');
      req.flash('error', 'User Name or Password incorrect!!!');
      res.render('auth/login');
    }
  } catch (error) {
    next(error);
  }
});

router.post('/signup', isNotFFilled, async (req, res, next) => {
  /* retrieves username and password */
  const { username, password } = req.body;
  try {
    /* Beguin looking for if the user exist */
    const user = await User.findOne({ username });
    /* Try find a user if exist before creation */
    if (user) {
      console.log('User Exist in database');
      req.flash('error', 'User already exists try with another username');
      res.redirect('auth/signup');
    } else {
      console.log("User doesn't no exist!!! I'm going to create one");
      /* Here we hash de password and begin with layers salt */
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);
      /* Create de user because is allright */
      await User.create({ username, hashedPassword });
      console.log(`User ${username} created`);
      res.render('/created');
    }
  } catch (error) {
    /* Here receive a posible error of the other catch */
    req.flash('error', 'Error Tray again!!!');
    res.redirect('/signup');
  }
});

router.get('/private', isUserLoggedIn, (req, res, next) => {
  res.render('private');
});

router.get('/created', (req, res, next) => {
  console.log('estoy en created');
  res.render('created');
});

router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    // cannot access session here
    if (err) {
      next(err);
    }
    res.redirect('/login');
  });
});

module.exports = router;
