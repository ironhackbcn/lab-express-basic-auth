module.exports = {
  // Protected Route - If user is login it will protect route and redirect at home
  requireAnonymus (req, res, next) {
    if (req.session.currentUser) {
      return res.redirect('/');
    }
    next();
  },
  // Protected Route - If user is not login, it will protect route and redirect at home
  requireLogin (req, res, next) {
    if (!req.session.currentUser) {
      return res.redirect('/');
    }
    next();
  },
  requireFields (req, res, next) {
    // Fields from form
    const { username, password } = req.body;
    // Check if password and username fields are empty
    if (!password || !username) {
      // Flash message
      req.flash('FormValidation', 'Username and Password required!');
      // Redirect to path of the request
      console.log(req.path);
      return res.redirect(`${req.path}`);
    }
    next();
  }
};
