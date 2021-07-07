const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { requireUser, requireAnon, requireFields } = require('../middlewares/auth');

router.get('/login', requireAnon, (req, res, next) => {
  const data = {
    messages: req.flash('validation')
  };
  res.render('auth/login', data);
});

router.post('/login', requireAnon, requireFields, async (req, res, next) => {
  // Extraer informacion del body
  const { username, password } = req.body;

  // Comprobar que el usuario existe
  try {
    const user = await User.findOne({ username });
    if (!user) {
      req.flash('validation', 'The usarname or password are wrong');
      res.redirect('/auth/login');
      return;
    }
    // Comparar contrasena
    if (bcrypt.compareSync(password /* provided password */, user.password/* hashed password */)) {
      // Save the login in the session!
      req.session.currentUser = user;
      res.redirect('/');
    } else {
      req.flash('validation', 'The usarname or password are wrong');
      res.redirect('/auth/login');
    }
  } catch (err) {
    next(err);
  }
});

router.post('/logout', requireUser, (req, res, next) => {
  delete req.session.currentUser;

  res.redirect('/');
});

module.exports = router;
