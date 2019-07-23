'use strict'

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session)
const bcrypt     = require('bcrypt');
const saltRounds = 10;
const {isLoggedIn,isNotLoggedIn,isFormFilled} = require('../Middlewares/appMiddlewares')
const User = require('../models/User')

/* GET home page. */
router.get('/signup', isLoggedIn, (req, res, next) => {
  res.render('signup')
})

router.post('/signup',isLoggedIn, isFormFilled, async (req, res, next) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    if (user) {
      return res.redirect('/auth/signup')
    }
    const salt = bcrypt.genSaltSync(saltRounds)
    const hashedPassword = bcrypt.hashSync(password, salt)
    const newUser = await User.create({ username, password: hashedPassword })
    req.session.currentUser = newUser
    res.redirect('/')
  } catch (error) {
    next(error)
  }
})

router.get('/login', isLoggedIn, (req, res, next) => {
  res.render('login')
})

router.post('/login', isLoggedIn, isFormFilled, async (req, res, next) => {
  const { username, password } = req.body
  try {
    const user = await User.findOne({ username })
    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user
        res.redirect('/')
      } else {
        res.redirect('/auth/login')
      }
    } else {
      res.redirect('/auth/login')
    }
    res.redirect('/')
  } catch (error) {
    next(error)
  }
})

router.post('/logout', isNotLoggedIn, (req, res, next) => {
  delete req.session.currentUser;
  res.redirect('/')
})

router.get('/main', isNotLoggedIn, (req, res, next) => {
  res.render('main')
})

router.get('/private', isNotLoggedIn, (req, res, next) => {
  res.render('private')
})

module.exports = router