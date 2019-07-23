'use strict';

const express = require('express');
const router = express.Router();
const { isNotLoggedIn } = require('../middlewares/authMiddlewares.js');
const User = require('../models/Users');

/* GET users listing. */
router.get('/private', isNotLoggedIn, async (req, res, next) => {
  const userId = req.session.currentUser._id;
  const user = await User.findById(userId).populate('recipes');
  console.log(user);
  res.render('private', user);
});

module.exports = router;
