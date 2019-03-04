const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

const User = require('../models/User');

const saltRounds = 10;

router.get('/signup', (req, res, next) => {
  // Lo siguiente mira si hay un usuario ya logueado y si lo hay no te permite acceder al signup
  if (req.session.currentUser) {
    res.redirect('/');
    return;
  }
  const data = {
    messages: req.flash('validation')
  };
  res.render('auth/signup', data);
});

router.post('/signup', async (req, res, next) => {
  // Lo siguiente no me deja acceder al signup si ya estoy registrado como un usuario.
  if (req.session.currentUser) {
    res.redirect('/');
    return;
  }
  // Extraer el body
  const { username, password } = req.body;
  // Comprabar que user name y password existen.
  if (!password || !username) {
    req.flash('validation', 'Username or password missing');
    res.redirect('/auth' + req.path);
    return;
  }
  // Comprobar que el usuario no existe en la base de datos.
  try {
    const result = await User.findOne({ username });
    if (result) {
      req.flash('validation', 'This username is taken');
      res.redirect('/auth/signup');
      return;
    }
    // Encriptar el password.

    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    // Crear el usuario.
    const newUser = {
      username,
      password: hashedPassword
    };

    const createdUser = await User.create(newUser);
    // Guardamos el usuario en la sesion.
    req.session.currentUser = createdUser;
    // Redirigimos a la home page.
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
