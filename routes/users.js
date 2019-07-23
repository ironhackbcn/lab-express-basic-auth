'use strict';

const express = require('express');
const router = express.Router();
const { isNotLoggedIn } = require('../middleware/authMiddleware.js');
// const User = require('../models/User.js')

/* GET users listing. */
router.get('/private', isNotLoggedIn, (req, res, next) => {
  // const userId = req.session.currentUser._id
  // const user = User.findById(userId)
  // console.log(user)
  res.render('private');
});

router.get('/main', isNotLoggedIn, (req, res, next) => {
  res.render('main');
});

module.exports = router;
