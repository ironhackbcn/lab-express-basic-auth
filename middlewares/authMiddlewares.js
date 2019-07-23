'use strict';

const isLoggedIn = (req, res, next) => {
  if (req.session.currentUser) { // si ese usuario entra aquí estando logeado, redirige a la home.
    return res.redirect('/'); // con return paramos la función y no hace el segundo res
  }
  next();
};

const isNotLoggedIn = (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/');
  }
  next();
};

const isFormFilled = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.redirect(req.path); // req.path hace referencia a la ruta desde la que se ha hecho la request
  }
  next();
};

module.exports = {
  isLoggedIn,
  isNotLoggedIn,
  isFormFilled
};
