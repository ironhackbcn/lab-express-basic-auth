module.exports = {
    requireUser (req, res, next) {
        if (!req.session.user) {
            return res.redirect('/');
        }
        next();
    },
    requireAnon (req, res, next) {
        if (req.session.user) {
            res.redirect('/');
            return;
        }
        next();
    },
    requireFields (req, res, next) {
        const { username, password } = req.body;
        if (!password || !username) {
            req.flash('validation', 'Username or pw missing');
            res.redirect('/auth' + req.path);
            return;
        }
        next();
    }
};
