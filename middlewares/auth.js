module.exports = {
  requireAnon (req, res, next) {
    if (req.session.currentUser) {
      res.redirect('/main')
      return
    }
    next()
  },
  requireUser (req, res, next) {
    if (!req.session.currentUser) {
      res.redirect('/')
      return
    }
    next()
  },

  requireFields (req, res, next) {
    const { username, password } = req.body
    if (!password || !username) {
      req.flash('validation', 'Fill al the fields')
      res.redirect(req.path)
      return
    }
    next()
  }
}
