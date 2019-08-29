onst express = require('express');
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

/* GET sign up page. */
router.get('/', (req, res, next) => {
  res.render('auth/login', { title: 'Log in' });
});