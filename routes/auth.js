'use strict';

const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/User.js');
const { isLoggedIn, isNotLoggedIn, isFormFilled } = require('../middlewares/authMiddlewares.js');

const saltRounds = 10;
const router = express.Router();

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

module.exports = router;
