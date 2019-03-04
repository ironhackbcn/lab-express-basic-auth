const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

const User = require('../models/User');

const saltRounds = 10;

router.get('/signup', (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect('/');
    return;
  }
  res.render('auth/signup');
});

router.post('/signup', async (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect('/');
    return;
  }
  // Extraer body
  const { username, password } = req.body;
  // Comprobar que username y password existen
  if (!password || !username) {
    res.redirect('/auth/signup');
    return;
  }
  // Comprobar que el usuario no existe en la base de datos
  try {
    const result = await User.findOne({ username: username });
    if (result) {
      res.redirect('/auth/signup');
      return;
    } else {
      // Encriptar el password
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);
      // Crear el usuario
      const newUser = {
        username,
        password: hashedPassword
      };
      const createdUser = await User.create(newUser);
      // Guardamos el usuario
      req.session.currentUser = createdUser;
      // Redirigimos para la homepage
      res.redirect('/');
    }
  } catch (error) {
    next(error);
  }
  res.render('auth/signup');
});

router.get('/login', (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect('/');
    return;
  }
  res.render('auth/login');
});

router.post('/login', async (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect('/');
    return;
  }
  // Extraer informacion del body
  const { username, password } = req.body;
  // Comprobar que hay usuario y password
  if (!password || !username) {
    res.redirect('/auth/login');
    return;
  }
  try {
  // Comprobar que el usuario existe en la db
    const user = await User.findOne({ username });
    if (!user) {
      res.redirect('/auth/login');
      return;
    }
    // Comparar la contrasena
    if (bcrypt.compareSync(password, user.password)) {
      // Guardar la sesion
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

router.post('/logout', (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect('/');
    return;
  }
  delete req.session.currentUser;
  res.redirect('/');
});

module.exports = router;
