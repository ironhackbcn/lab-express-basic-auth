const express = require('express');
const router = express.Router();

const { requireUser } = require('../middlewares/auth');

router.get('/main', requireUser, (req, res, next) => {
    res.render('content/main');
});

router.get('/private', requireUser, (req, res, next) => {
    res.render('content/private');
});

module.exports = router;
