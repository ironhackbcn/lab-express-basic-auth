'use strict';

const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

module.exports = router;
