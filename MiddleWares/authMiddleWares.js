

/* eslint-disable linebreak-style */
const isUserLoggedIn= (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/');
  }
  next(){}
};

module.exports = { isUserLoggedIn };
