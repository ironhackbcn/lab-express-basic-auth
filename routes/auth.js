const express = require('express');
const router = express.Router();
const User = require('../models/User');

const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get('/signup', (req, res, next) => {
    const validation = {
        messages: req.flash('validation')
    };
    if (req.session.user) {
        res.redirect('/');
        return;
    }
    res.render('auth/signup', validation);
});

router.post('/signup', async (req, res, next) => {
    if (req.session.user) {
        res.redirect('/');
        return;
    }
    const { username, password } = req.body;
    if (!username || !password) {
        req.flash('validation', 'You must fill all fields.');
        res.redirect('/auth' + req.path);
        return;
    }
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

router.get('/login', (req, res, next) => {
    const validation = {
        messages: req.flash('validation')
    };
    if (req.session.user) {
        res.redirect('/');
        return;
    }
    return res.render('auth/login', validation);
});

router.post('/login', async (req, res, next) => {
    if (req.session.user) {
        res.redirect('/');
        return;
    }
    const { username, password } = req.body;
    if (!password || !username) {
        req.flash('validation', 'Username or pw missing');
        res.redirect('/auth' + req.path);
        return;
    }
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

router.post('/logout', (req, res, next) => {
    if (req.session.user) {
        delete req.session.user;
        return res.redirect('/');
    }
});

module.exports = router;
