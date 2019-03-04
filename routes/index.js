const express = require('express');
const router = express.Router();

const { requireUser } = require('../middlewares/auth');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get('/main', requireUser, (req, res, next) => {
  res.render('page/main');
});

router.get('/private', requireUser, (req, res, next) => {
  res.render('page/private');
});

module.exports = router;
