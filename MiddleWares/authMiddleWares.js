/* eslint-disable consistent-return */
/* eslint-disable linebreak-style */
const isUserLoggedIn = (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('index');
  }
  next();
};

const isUserNoLoggedIn = (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect(req.path);
  }
  next();
};
const isFFilled = (req, res, next) => {
  const { username: uNam, password: uPass } = req.body;
  if (!uNam || !uPass) {
    return res.redirect(req.path);
  }
  next();
};

module.exports = { isUserLoggedIn, isFFilled, isUserNoLoggedIn };
