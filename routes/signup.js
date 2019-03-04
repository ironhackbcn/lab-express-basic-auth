const express = require('express');
const router = express.Router();
// base de datods
const User = require('../models/User');
// encriptacion
const bcrypt = require('bcrypt');
const saltRounds = 10;
// middlewares
const { requireAnon, requireFields } = require('../middlewares/auth');

router.get('/signup', requireAnon, (req, res, next) => {
  const data = {
    messages: req.flash('validation')
  };
  res.render('auth/signup', data);
});

router.post('/signup', requireAnon, requireFields, async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // Comprobar que el usuario no existe
    const result = await User.findOne({ username }); // devuelve promise
    // si existe usuario
    if (result) {
      // muestra mensage
      req.flash('validation', 'The usarname is taken');
      // redirecciona a la pagina
      res.redirect('/auth/signup');
      return;
    }
    // Encryptar el password
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    // Crear el usuario
    const newUser = {
      username,
      // password encriptado
      password: hashedPassword
    };
    const createUser = await User.create(newUser);
    // Guardamos el usuario en la session (cookies)
    req.session.currentUser = createUser;
    // Redirigimos para la homepage
    res.redirect('/');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
