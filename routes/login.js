const express = require('express');
const router = express.Router();
const User = require('../models/user');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const bcrypt = require('bcrypt');


/* GET log in page. */
router.get('/', (req, res, next) => {
  res.render('auth/login');
});

/* POST log in page */
router.post('/', (req, res, next) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;
  // const { username, password } = req.body;
  if (theUsername === '' || thePassword === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, username and password to log in.'
    });
    return;
  } else {
    User.findOne({ 'username': theUsername })
    .then(user => {
      if (!user) {
        res.render('auth/login', {
          errorMessage: "The username doesn't exist."
        });
        return;
      }
      if (bcrypt.compareSync(thePassword, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.render('index', {user});
      } else {
        res.render('auth/login', {
          errorMessage: 'Incorrect password'
        });
      }
    })
    .catch(error => {
      next(error);
    })
  }
});

module.exports = router;