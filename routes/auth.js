'use strict';

const express = require('express');
// bcrypt - encriptar las contraseñas
const bcrypt = require('bcrypt');
// Factor de dificultad para encriptar la contraseña
const saltRounds = 10;
// Página donde crearemos todas las rutas de authentication
const { isLoggedIn, isNotLoggedIn, isFormFilled } = require('../middlewares/authMiddlewares.js');

const User = require('../models/User');
const router = express.Router();

// Enviará la información del formulario al usuario (GET)
router.get('/signup', isLoggedIn, (req, res, next) => {
  res.render('signup');
});

// Enviará la información del usuario a servidor (POST)
// body es post
// query es get
// params viaja en la url
router.post('/signup', isLoggedIn, isFormFilled, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    // bcrypt - Signup user
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    console.log(username);
    const user = await User.findOne({ username });
    if (user) {
      res.redirect('/auth/signup');
    }
    const newUser = User.create({
      username,
      password: hashedPassword
    });
    req.session.currentUser = newUser;
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

// Enviará la información del login al usuario (GET)
router.get('/login', isLoggedIn, (req, res, next) => {
  res.render('login');
});

// Enviará la información del login de usuario al servidor (POST)
router.post('/login', isLoggedIn, isFormFilled, async (req, res, next) => {
  // El const de abajo puede estar dentro o fuera del try
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return next();
    }
    // Login user
    if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      res.redirect('/');
    } else {
      res.redirect('/auth/login');
    }
  } catch (error) {
    next(error);
  }
});

// Para que el usuario se pueda desloguear  (POST)
router.post('/logout', isNotLoggedIn, (req, res, next) => {
  delete req.session.currentUser;
  res.redirect('/auth/login');
});

module.exports = router;
