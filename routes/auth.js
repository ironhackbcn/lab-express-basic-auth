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

router.get('/login', (req, res, next) => {
  // Lo siguiente mira si hay un usuario ya logueado y si lo hay no te permite acceder al login
  if (req.session.currentUser) {
    res.redirect('/');
    return;
  }
  // Lo siguiente (const data) es para que dependiendo de donde falle al loguearme me muestre un mensage.
  const data = {
    messages: req.flash('validation')
  };
  res.render('auth/login', data);
});

router.post('/login', async (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect('/');
    return;
  }
  // Extraer la información del body.
  const { username, password } = req.body;
  // Esto de aquí abajo lo podemos eleminar o comentar porque hemos creado la middleware requireFields
  // Comprobar que hay usuario y password.
  if (!password || !username) {
    req.flash('validation', 'Username or password missing');
    res.redirect('/auth' + req.path);
    return;
  }
  try {
    // Comprobar que el usuario existe.
    const user = await User.findOne({ username });
    if (!user) {
      req.flash('validation', 'Username or password incorrect');
      res.redirect('/auth/login');
      return;
    }
    // Comparar la contraseña.
    if (bcrypt.compareSync(password, user.password)) {
      // Save the login in the session!
      req.session.currentUser = user;
      // Redirigir
      res.redirect('/');
    } else {
      // aquí enseñamos el error si la contraseña está equivocada.
      req.flash('validation', 'Username or password incorrect');

      res.redirect('/auth/login');
    }
  } catch (error) {
    next(error);
  }
});

router.post('/logout', (req, res, next) => {
  // Esto de aquí abajo lo podemos eleminar o comentar porque hemos creado la middleware requireFields
  // si no estás logeado no podras hacer el logout.
  if (!req.session.currentUser) {
    res.redirect('/');
    return;
  }
  delete req.session.currentUser;

  res.redirect('/');
});

module.exports = router;
