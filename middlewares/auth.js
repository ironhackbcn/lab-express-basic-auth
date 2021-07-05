module.exports = {
  checkEmpty (req, res, next) {
    const { username, password } = req.body;
    if (!username || !password) {
      req.flash('validation', 'Missing fields');
      res.redirect(`/auth${req.path}`);
      return;
    }
    next();
  },
  checkNotLogged (req, res, next) {
    if (!req.session.currentUser) {
      res.redirect('/');
      return;
    }
    next();
  },
  checkLogged (req, res, next) {
    if (req.session.currentUser) {
      res.redirect('/');
      return;
    }
    next();
  }
};
