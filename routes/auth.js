const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/User");

const bcryptSalt = 10;

const router = express.Router();

/* GET signup page. */
router.get("/signup", (req, res, next) => {
  res.render("signup");
});

// create a user
router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  // si los campos no estan vacio
  if (username !== "" && password !== "") {
    User.findOne({ username })
      .then(user => {
        if (user) {
          console.log("user existe", user);
          // si existe el user error
          res.render("signup", { error: "usuario ya existe" });
        } else {
          console.log("user no existe", user);
          // hash del password
          const salt = bcrypt.genSaltSync(bcryptSalt);
          const hashedPassword = bcrypt.hashSync(password, salt);
          // creo el usuario
          User.create({ username, hashedPassword })
            .then(() => {
              console.log("redirect");
              // todo correcto
              res.redirect("/");
            })
            .catch(error => {
              throw error;
            });
        }
      })
      .catch(error => {
        res.render("signup", { error: "error vuelve a intentarlo" });
      });
  } else {
    res.render("signup", { error: "campos no pueden estar vacios" });
  }
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  if (username !== "" && password !== "") {
    User.findOne({ username })
      .then(user => {
        if (user) {
          if (bcrypt.compareSync(password, user.hashedPassword)) {
            // password valido
            // guardo la session
            req.session.currentUser = user;
            res.redirect("/loggedin");
          } else {
            // password invalido
            res.render("login", { error: "usuario o contraseña incorrectos" });
          }
        } else {
          res.redirect("/signup");
        }
      })
      .catch(() => {
        res.render("login", { error: "error vuelve a intentarlo" });
      });
  } else {
    res.render("login", { error: "campos no pueden estar vacios" });
  }
});

router.get("/logout", (req, res, next) => {
  req.session.destroy(err => {
    // cannot access session here
    if (err) {
      next(err);
    }
    res.redirect("/login");
  });
});

module.exports = router;
