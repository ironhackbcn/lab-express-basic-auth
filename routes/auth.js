const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const { isLoggedIn, isNotLoggedIn, isFormFilled } = require('../middlewares/authMiddlewares');
const User = require('../models/User.js');

const router = express.Router();

/* GET home page. */
router.get('/signup', isLoggedIn, (req, res, next) => {
  res.render('auth/signup');
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

    await User.create({
      username,
      password: hashedPassword
    });

    res.redirect('/auth/login');
  } catch (error) {
    next(error);
  }
});

router.get('/login', isLoggedIn, (req, res, next) => {
  res.render('auth/login');
});

router.post('/login', isLoggedIn, isFormFilled, async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.redirect('/auth/login');
    }

    if (bcrypt.compareSync(password /* provided password */, user.password/* hashed password */)) {
      // Save the login in the session!
      req.session.currentUser = user;
      res.redirect('/private-content');
    } else {
      res.redirect('/auth/login');
    }
  } catch (error) {
    next(error);
  }
});

router.post('/logout', isNotLoggedIn, (req, res, next) => {
  delete req.session.currentUser;
  res.redirect('/auth/login');
});

module.exports = router;
