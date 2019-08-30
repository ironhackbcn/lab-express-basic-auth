/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable consistent-return */

const isUserLoggedIn = (req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect('auth/login');
  }
};

const isUserNoLoggedIn = (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('auth/login');
  }
  next();
};

const isFFilled = (req, res, next) => {
  const { username: uNam, password: uPass } = req.body;
  if (!uNam || !uPass) {
    return res.redirect(req.path);
  }
  console.log('Empty spaces');
  next();
};

module.exports = { isUserLoggedIn, isFFilled, isUserNoLoggedIn };
