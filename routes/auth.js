const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

const User = require('../models/User');

const { requireAnon, requireUser, requireFields } = require('../middlewares/auth');

const saltRounds = 10;

/* GET home page. */
router.get('/signup', requireAnon, (req, res, next) => {
  const data = {
    messages: req.flash('validation')
  };
  res.render('auth/signup', data);
});

/* GET home page. */
router.post('/signup', requireAnon, requireFields, async (req, res, next) => {
  // Extraer body
  const { username, password } = req.body;
  // Comprobar que el usuario no existe en la base de datos
  try {
    const result = await User.findOne({ username });
    if (result) {
      req.flash('validation', 'This username is taken');
      res.redirect('/auth/signup');
      return;
    }
    // Encriptar el password
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    // Crear el usuario
    const newUser = {
      username,
      password: hashedPassword
    };
    const createdUser = await User.create(newUser);
    // Guardamos el usuario en la sesion
    req.session.currentUser = createdUser;
    // Redirigimos para la homepage
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

router.get('/login', requireAnon, (req, res, next) => {
  const data = {
    messages: req.flash('validation')
  };
  res.render('auth/login', data);
});

router.post('/login', requireAnon, requireFields, async (req, res, next) => {
  // Extraer la información del body
  const { username, password } = req.body;
  // Comprobar que hay usuario y password
  try {
    // Comprobar que el usuario existe
    const user = await User.findOne({ username });
    if (!user) {
      req.flash('validation', 'Not user or password');
      res.redirect('/auth/login');
      return;
    }
    // Comparar contraseña
    if (bcrypt.compareSync(password, user.password)) {
      // Guardar la sesión
      req.session.currentUser = user;
      // Redirigir
      res.redirect('/');
    } else {
      res.redirect('/auth/login');
    }
  } catch (error) {
    next(error);
  }
});

router.post('/logout', requireUser, async (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect('/');
    return;
  }
  delete req.session.currentUser;

  res.redirect('/');
});

module.exports = router;
