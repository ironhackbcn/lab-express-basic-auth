/* eslint-disable linebreak-style */
/* eslint-disable eol-last */
/* eslint-disable no-unused-vars */
const express = require('express');

const router = express.Router();

const bcrypt = require('bcryptjs');

const saltRounds = 10;

const User = require('../models/user');

const { isUserLoggedIn, isFFilled, isUserNoLoggedIn } = require('../MiddleWares/authMiddleWares');


router.post('/login', isFFilled, (req, res, next) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;

  if (theUsername === '' || thePassword === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, username and password to sign up.',
    });
    return;
  }

  User.findOne({ username: theUsername })
    .then((user) => {
      if (!user) {
        res.render('auth/login', {
          errorMessage: "The username doesn't exist.",
        });
        return;
      }
      if (bcrypt.compareSync(thePassword, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect('/');
      } else {
        res.render('auth/login', {
          errorMessage: 'Incorrect password',
        });
      }
    })
    .catch((error) => {
      next(error);
    });
});

router.post('/signin', isFFilled, (req, res, next) => { 
  /* retrieves username and password */
  const { username, password } = req.body;
  /* use salt because remains resistant to brute-force attacks */
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashPassword = bcrypt.hashSync(password, salt);
  

});


module.exports = router;