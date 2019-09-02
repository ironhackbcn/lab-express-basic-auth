const express = require('express');
const User = require('../models/User');
const { checkFields, createUser, LogIn } = require('../middlewares');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

router.get('/create', (req, res) => {
  res.render('create');
});

router.post('/create', checkFields, async (req, res) => {
  const { username, password } = req.body;
  try {
    if (await User.findOne({ username })) {
      // Ya exite, le devulevo un mensage
      req.flash('info', 'User already exists');
      res.redirect('/create');
    } else {
      // No existe. lo creo.
      const user = await createUser(username, password);
      req.session.currentUser = user;
      req.flash('info', 'user created');
      res.redirect('/users/admin');
    }
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/create');
  }
});

router.get('/login', (req, res) => {
  res.render('login');
});
router.post('/login', checkFields, async (req, res) => {
  const { username, password } = req.body;
  try {
    LogIn(username, password, req, res);
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/login');
  }
});

module.exports = router;
