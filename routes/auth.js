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
  res.render('auth/signup');
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
    res.redirect('/auth/signup');
    return;
  }
  // Comprobar que el usuario no existe en la base de datos.
  try {
    const result = await User.findOne({ username });
    if (result) {
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
