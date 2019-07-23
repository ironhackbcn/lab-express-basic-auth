const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const saltRounds = 10;


const User = require('../models/User');

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signUp', (req, res, next) => {
  res.render('signUp');
});

router.post('/newUser', async (req, res, next) => {
  try {
  const { username, password } = req.body;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);
  const user = await User.findOne({ username });
  if (user) {
    return res.redirect('/');
  }
  const newUser = await User.create({
    username,
    password: hashedPassword
  });

  req.session.currentUser = newUser;
  res.redirect('/');
} catch (error) {
  next(error);
}
});


module.exports = router;
