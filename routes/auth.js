// importamos express
const express = require('express');
const router = express.Router();

// importamos el middleware auth que hemos creado
const { checkEmpty, checkNotLogged, checkLogged } = require('../middlewares/auth');

// importamos el modelo de users
const User = require('../models/Users');

// hacemos npm install de bcrypt y lo requerimos para encriptar la password
const bcrypt = require('bcrypt');
const saltRounds = 10;

// cuando se ejecuta el get del anchor a signup renderizamos el archivo signup
router.get('/signup', checkLogged, (req, res, next) => {
  const data = {
    messages: req.flash('validation')
  };
  res.render('auth/signup', data);
});

// Pasamos el middleware, cogemos el body del post en signup
router.post('/signup', checkLogged, checkEmpty, async (req, res, next) => {
  console.log('hola');
  const { username, password } = req.body;

  try {
    const coincidence = await User.findOne({ username: username });

    if (coincidence) {
      req.flash('validation', 'Username taken');
      res.redirect('/auth/signup');
      return;
    } else {
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);
      const newUser = {
        username: username,
        password: hashedPassword
      };
      const createdUser = await User.create(newUser);
      req.session.currentUser = createdUser;

      res.redirect('/');
    }
  } catch (error) {
    next(error);
  }
});

// cuando se ejecuta el get del anchor a login renderizamos el archivo login
router.get('/login', checkLogged, (req, res, next) => {
  const data = {
    messages: req.flash('validation')
  };
  res.render('auth/login', data);
});

router.post('/login', checkLogged, checkEmpty, async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      req.flash('validation', 'Invalid username/password');
      res.redirect('/auth/login');
      return;
    }

    if (bcrypt.compareSync(password /* provided password */, user.password/* hashed password */)) {
      req.session.currentUser = user;
      res.redirect('/');
    } else {
      req.flash('validation', 'Invalid username/password');
      res.redirect('/auth/login');
    }
  } catch (error) {
    next(error);
  }
});

// cogemos la acción del botón logout para borrar el currentUser de la sesión (primero ponemos tuberia)
// para que sea accesible solo al estar loggeado
router.post('/logout', checkNotLogged, (req, res, next) => {
  delete req.session.currentUser;
  res.redirect('/');
});

// exportamos la ruta a app.js
module.exports = router;
