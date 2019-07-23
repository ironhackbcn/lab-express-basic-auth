'use strict';

const express = require('express');
const router = express.Router();
const { isNotLoggedIn } = require('../middlewares/authMiddlewares');

/* GET users listing. */
router.get('/private', isNotLoggedIn, async (req, res, next) => {
  res.render('private');
});

module.exports = router;
