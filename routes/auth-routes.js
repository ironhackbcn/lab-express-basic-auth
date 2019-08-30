/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable eol-last */
/* eslint-disable no-unused-vars */
const express = require('express');

const router = express.Router();

const bcrypt = require('bcryptjs');

const saltRounds = 10;

const User = require('../models/user');

const { isUserLoggedIn, isFFilled, isUserNoLoggedIn } = require('../MiddleWares/authMiddleWares');

router.get('/login', (req, res, next) => {
  console.log('load log in form');
  res.render('auth/login');
});

router.get('/signup', (req, res, next) => {
  console.log('load sign up form');
  res.render('auth/signup');
});

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;
  if (username !== '' && password !== '') {
    User.findOne({ username })
      .then((user) => {
        if (user) {
          if (bcrypt.compareSync(password, user.hashedPassword)) {
            req.session.currentUser = user;
            res.render('private');
          } else {
            // password invalido
            res.render('auth/login', { errorMessage: 'User Name or Password incorrect!!!' });
          }
        } else {
          res.redirect('auth/signup');
        }
      })
      .catch(() => {
        res.render('auth/login', { errorMessage: 'Tray Again' });
      });
  } else {
    res.render('auth/login', { errorMessage: 'Username and password fields cannot be empty' });
  }
});

router.post('/signup', (req, res, next) => {
  /* retrieves username and password */
  const { username, password } = req.body;
  /* use salt because remains resistant to brute-force attacks */
  if (username !== '' && password !== '') {
  /* Beguin looking for if the user exist */
    User.findOne({ username })
    /* Try find a user if existe before creation */
      .then((user) => {
        if (user) {
          console.log('User Exist in database');
          res.render('auth/signup', { errorMessage: 'User already exists try with another username' });
        } else {
          console.log('User doesn\'t no exist!!! I\'m going to create one');
          /* Here we hash de password and begin with layers salt */
          const salt = bcrypt.genSaltSync(saltRounds);
          const hashedPassword = bcrypt.hashSync(password, salt);
          /* Create de user because is allright */
          User.create({ username, hashedPassword })
            .then(() => {
              console.log(`User ${username} created`);
              res.redirect('../created');
            })
            .catch((error) => {
              throw (error);
            });
        }
      }) /* Here receive a posible error of the other catch */
      .catch((error) => {
        res.render('signup', { erroMessage: 'Error Tray again!!!' });
      });
  } else {
    res.render('signup', { errorMessage: 'Username and Password cannot be empty' });
  }
});

router.get('/private', isUserLoggedIn, (req, res, next) => {
  res.render('private');
});

router.get('/created', isUserLoggedIn, (req, res, next) => {
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