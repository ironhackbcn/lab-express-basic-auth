// comprobar si el usuario esta logueado
const isUserLoggedIn = (req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    req.flash('error', 'you are not logged in yet');
    res.redirect('/login');
  }
};
// comprobar si el formulario esta relleno
const isNotFFilled = (req, res, next) => {
  const { username, password } = req.body;
  if (username !== '' && password !== '') {
    res.locals.auth = req.body;
    next();
  } else {
    req.flash('error', 'please fill out the form');
    res.redirect(req.path);
  }
};

const notifications = () => (req, res, next) => {
  res.locals.errorMessages = req.flash('error');
  res.locals.infoMessages = req.flash('info');
  res.locals.dangerMessages = req.flash('danger');
  res.locals.successMessages = req.flash('success');
  res.locals.warningMessages = req.flash('warning');
  next();
};

module.exports = { isNotFFilled, isUserLoggedIn, notifications };
