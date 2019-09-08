/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
const express = require('express');

const router = express.Router();
const { isUserLoggedIn, isFFilled } = require('../MiddleWares/authMiddleWares');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express-Basic-Authorization' });
});

module.exports = router;
