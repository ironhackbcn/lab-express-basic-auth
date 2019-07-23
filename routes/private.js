'use strict';

const express = require('express');
const router = express.Router();
const { isNotLoggedIn } = require('../middlewares/authMiddlewares.js');

/* GET home page. */
router.get('/', isNotLoggedIn, (req, res, next) => {
  res.render('private');
});

module.exports = router;
