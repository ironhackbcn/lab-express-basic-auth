const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/main', (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect('/');
    return;
  }
  res.render('auth/main');
});

router.get('/private', (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect('/');
    return;
  }
  res.render('auth/private');
});

module.exports = router;
