module.exports = {
  requireAnon (req, res, next) {
    if (req.session.currentUser) {
      res.redirect('/');
      return;
    }
    next();
  },
  requireUser (req, res, next) {
    if (!req.session.currentUser) {
      res.redirect('/');
      return;
    }
    next();
  },

  requireFields (req, res, next) {
    const { username, password } = req.body;

    // Comprobar que username y password existen
    if (!password || !username) {
      req.flash('validation', 'Username or password empty');
      res.redirect(`/auth${req.path}`);
      return;
    }
    next();
  }

};
