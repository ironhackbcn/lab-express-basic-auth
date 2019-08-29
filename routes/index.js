/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
const express = require('express');

const router = express.Router();

const { isUserLoggedIn, isFFilled } = require('../MiddleWares/authMiddleWares');

/* GET home page. */

router.get('/login', (req, res, next) => {
  console.log('pulso login');
  res.render('auth/login');
});

router.get('/signup', (req, res, next) => {
  console.log('pulso sign in');
  res.render('auth/signup');
});

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});




module.exports = router;
