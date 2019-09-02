const express = require('express');

const router = express.Router();

const { checkLoggin } = require('../middlewares');

router.use(checkLoggin);

router.get('/admin', (req, res) => {
  res.render('users/admin');
});

router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err);
    }
    res.redirect('/login');
  });
});

module.exports = router;
