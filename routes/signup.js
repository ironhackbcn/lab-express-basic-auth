const express = require('express');
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

/* GET sign up page. */
router.get('/', (req, res, next) => {
  res.render('auth/signup', { title: 'Sign up' });
});

/* POST what the user has entered */

router.post("/", (req, res, next) => {
  const { username, password } = req.body;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashedPassword = bcrypt.hashSync(password, salt);  
  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  } else {
    User.findOne({ username })
      .then((user) => {
        if (user !== null) {
          res.render("auth/signup", {
            errorMessage: "The username already exists!"
          });
          return;
        } 
          User.create({
            username,
            password: hashedPassword
          })
            .then(() => {
              res.render("index");
            })
            .catch(error => {
              console.log(error);
            })
        })
        .catch(error => {
          next(error);
        })
  }
});

module.exports = router;