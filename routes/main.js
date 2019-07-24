'use strict';

const express = require('express');
const router = express.Router();
const { isNotLoggedIn } = require('../middlewares/authMiddlewares.js');

router.get('/', isNotLoggedIn, (req, res, next) => {
  res.render('main');
});

module.exports = router;
