const express = require('express');
const router  = express.Router();
const User    = require('../models/User');
const bcrypt  = require('bcrypt');
const bcryptSalt = 10;

// GET signup page.
router.get('/signup', (req, res, next) => {
  res.render('users/signup');
});

// POST signup form
router.post('/signup', (req, res, next) => {
  const {username, password} = req.body;
  const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    User.findOne({'username': username})
      .then(user => {
        if (user !== null) {
          res.render('users/signup', {error: 'Username taken'});
          return;
        }
        if (username === "" || password === "") {
          res.render('users/signup', {error: 'Enter a username and password'});
          return;
        }
        User.create({username, password: hashPass})
          .then(() => {res.redirect('/')})
          .catch(error => {console.log(error)});
      })
      .catch(error => {console.log(error)});
});

// GET signin page
router.get('/signin', (req, res, next) => {
  res.render('users/signin');
});

// POST signin form
router.post('/signin', (req, res, next) => {
  const {username, password} = req.body;
  if (username === "" || password === "") {
    res.render('users/signin', {error: 'You must enter a username and password' });
    return;
  }
  User.findOne({'username': username})
    .then(user => {
      if (!user) {
        res.render('users/signin', {error: "That username doesn't exist"})
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect('/');
      } else {
        res.render('users/signin', {error: "Incorrect password"})
      }
    })
    .catch(error => {console.log(error)});
})

// GET Signout page
router.get("/signout", (req, res, next) => {
  req.session.destroy((error) => {res.redirect("/users/signin")});
});

module.exports = router;