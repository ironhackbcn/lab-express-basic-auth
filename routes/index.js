const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    if (!req.session.user) {
        res.redirect('/auth/signup');
        return;
    }
    res.render('index', { title: 'Express' });
});

module.exports = router;
