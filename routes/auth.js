const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/User');
const { requireAnon, requireUser, requireFields } = require('../middlewares/auth');

const saltRounds = 10;

router.get('/signup', requireAnon, (req, res, next) => {
  const data = {
    messages: req.flash('validation')
  };
  res.render('auth/signup', data);
});

router.post('/signup', requireAnon, requireFields, async (req, res, next) => {
  // Extraer body
  const { username, password } = req.body;
  // comprobar que el usuario no existe
  try {
    const result = await User.findOne({ username });
    // Si el usuario existe
    if (result) {
      // Enviamos el mensaje al GET de arriba
      req.flash('validation', 'The username is taken');
      res.redirect('/auth/signup');
      return;
    }
    // Encriptar password
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    // crear el usuario
    const newUser = {
      username,
      password: hashedPassword
    };
    const createdUser = await User.create(newUser);
    // Guardamos erl usuario en la sesion
    req.session.currentUser = createdUser;
    // redirigimos para la homepage
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});
// --------------Login----------------------------------
router.get('/login', requireAnon, (req, res, next) => {
  const data = {
    messages: req.flash('validation')
  };
  res.render('auth/login', data);
});

router.post('/login', requireAnon, requireFields, async (req, res, next) => {
  // Extraer informacion del body
  const { username, password } = req.body;
  // comprobar que el usuario no existe
  try {
    const user = await User.findOne({ username });
    if (!user) {
      req.flash('validation', 'The username or password incorrect');
      res.redirect('/auth/login');
      return;
    }
    // comparar la contraseña
    if (bcrypt.compareSync(password, user.password)) {
      // Save the login in the session!
      req.session.currentUser = user;
      res.redirect('/');
    } else {
      req.flash('validation', 'The username or password incorrect');
      res.redirect('/auth/login');
    }
  } catch (error) {
    next(error);
  }
});
// ---------------------Logout------------------//
router.post('/logout', requireUser, async (req, res, next) => {
  delete req.session.currentUser;
  res.redirect('/');
});

// ---------------------Main--------------------//
router.get('/main', requireUser, (req, res, next) => {
  res.render('auth/main');
});
// ---------------------Private--------------------//
router.get('/private', requireUser, (req, res, next) => {
  res.render('auth/private');
});
module.exports = router;
