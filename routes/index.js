const express = require('express');
const router = express.Router();
const { checkNotLogged } = require('../middlewares/auth');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get('/main', checkNotLogged, (req, res, next) => {
  res.render('../views/protected/main.hbs');
});

router.get('/private', checkNotLogged, (req, res, next) => {
  res.render('../views/protected/private.hbs');
});

module.exports = router;
