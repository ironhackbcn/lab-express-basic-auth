/* eslint-disable consistent-return */
/* eslint-disable linebreak-style */
const isUserLoggedIn = (req, res, next) => {
  if (app.locals.currentUser) {
    return res.redirect('private');
  }
  next();
};

const isUserNoLoggedIn = (req, res, next) => {
  if (!app.locals.currentUser) {
    return res.redirect("auth/login");
  }
  next();
};

const isFFilled = (req, res, next) => {
  const { username: uNam, password: uPass } = req.body;
  if (!uNam || !uPass) {
    return res.redirect(req.path);
  }
  console.log ('espacios vacios');
  next();
};

module.exports = { isUserLoggedIn, isFFilled, isUserNoLoggedIn };
