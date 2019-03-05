const express = require('express');
const router = express.Router();
// Requermimos base de datos
const User = require('../models/User');
// Requerimos encriptacion
const bcrypt = require('bcrypt');
// Usamos los 3 middlewares
const { requireUser, requireAnon, requireFields } = require('../middlewares/auth');

router.get('/login', requireAnon, (req, res, next) => {
  const data = {
    messages: req.flash('validation')
  };
  res.render('auth/login', data);
});

router.post('/login', requireAnon, requireFields, async (req, res, next) => {
  // Extraer informacion del body(el usuario introducido y contraseña)
  const { username, password } = req.body;

  // Comprobar que el usuario existe
  try {
    const user = await User.findOne({ username });
    // Sino existe usuario
    if (!user) {
      // Nombre o Pass invalidos para no dar pistas
      req.flash('validation', 'The usarname or password are wrong');
      // Redireccionamos al login
      res.redirect('/auth/login');
      return;
    }
    // Comparar contraseña para ver si entramos a la sesion
    if (bcrypt.compareSync(password /* provided password */, user.password /* hashed password */)) {
      // Save the login in the session!
      req.session.currentUser = user;
      res.redirect('/');
    } else {
      // Si contraseña es diferente
      req.flash('validation', 'The usarname or password are wrong');
      res.redirect('/auth/login');
    }
  } catch (err) {
    next(err);
  }
});

// En el logout que cancele la session

router.post('/logout', requireUser, (req, res, next) => {
  // Elimina la sesion
  delete req.session.currentUser;

  res.redirect('/');
});

module.exports = router;
