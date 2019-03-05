'use strict';

module.exports = {
  requireAnon (req, res, next) {
    // Si hay un usuario en la sesion
    if (req.session.currentUser) {
      res.redirect('/');
      return;
    }
    next();
  },

  requireUser (req, res, next) {
    // Si no hay un usuario en la sesion
    if (!req.session.currentUser) {
      res.redirect('/');
      return;
    }
    next();
  },

  requireFields (req, res, next) {
    // Si no se ha introducido o pasword o contraseña
    const { username, password } = req.body;
    if (!password || !username) {
      // Muestra mensage que usuario o pasword se ha perdido
      req.flash('validation', 'Username or passowrd missing');
      // Redirecciona a
      res.redirect(`/auth/${req.path}`);
      return;
    }
    next();
  }
};
