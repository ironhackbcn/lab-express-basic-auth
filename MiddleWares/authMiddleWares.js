/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable consistent-return */


const isUserLoggedIn = (req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect('/login');
  }
};

const isNotFFilled = (req, res, next) => {
  const { username: uNam, password: uPass } = req.body;
  if (uNam !== '' && uPass !== '') {
    res.locals.auth = req.body;
    next();
  }
  req.flash('error', 'campos no pueden estar vacios');
  res.render('/signup', { errorMessage: 'Fields can not be empty!' });
};


module.exports = { isUserLoggedIn, isNotFFilled };
