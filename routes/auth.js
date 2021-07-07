const express = require('express');
const router = express.Router();
const User = require('../models/User');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const { requireUser, requireAnon, requireFields } = require('../middlewares/auth');

router.get('/signup', requireAnon, (req, res, next) => {
    const validation = {
        messages: req.flash('validation')
    };
    res.render('auth/signup', validation);
});

router.post('/signup', requireAnon, requireFields, async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user) {
            req.flash('validation', 'Username already taken.');
            res.redirect('/auth/signup');
            return;
        }
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);
        const newUser = {
            username,
            password: hashedPassword
        };
        const createdUser = await User.create(newUser);
        req.session.user = createdUser;
        res.redirect('/');
    } catch (err) {
        next(err);
    }
});

router.get('/login', requireAnon, (req, res, next) => {
    const validation = {
        messages: req.flash('validation')
    };
    return res.render('auth/login', validation);
});

router.post('/login', requireAnon, requireFields, async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const newUser = await User.findOne({ username });
        if (!newUser) {
            req.flash('validation', 'User or pw incorrect');
            res.redirect('/auth' + req.path);
            return;
        }
        if (bcrypt.compareSync(password, newUser.password)) {
            req.session.user = newUser;
            res.redirect('/');
            return;
        } else {
            req.flash('validation', 'User or pw incorrect');
            res.redirect('/auth' + req.path);
            return;
        }
    } catch (err) {
        next(err);
    }
});

router.post('/logout', requireUser, (req, res, next) => {
    delete req.session.user;
    return res.redirect('/');
});

module.exports = router;
