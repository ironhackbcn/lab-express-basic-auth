/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable consistent-return */

const isUserLoggedIn = (req, res, next) => {
  if (req.session.currentUser) {
    console.log('esto es lo que hay aqui', req.path);
    if (req.path === '/login') res.redirect('/private');
    if (req.path === '/signup') res.redirect('/private');
    next();
  } else {
    if (req.path === '/private') res.redirect('/login');
    if (req.path === '/created') res.redirect('/login');
    res.redirect(req.path);
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
