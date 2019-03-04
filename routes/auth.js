const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { requireAnon, requireUser, requireFields } = require('../middlewares/auth');

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
    const result = await User.findOne({ username: username });
    if (result) {
      req.flash('validation', 'The usarname is taken');
      res.redirect('/auth/signup');
      return;
    }
    // Encryptar el password
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    // Crear el usuario
    const newUser = {
      username,
      password: hashedPassword
    };
    const createUser = await User.create(newUser);
    // Guardamos el usuario en la session
    req.session.currentUser = createUser;
    // Redirigimos para la homepage
    res.redirect('/');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
