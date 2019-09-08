/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const express = require("express");

const router = express.Router();
const bcrypt = require("bcrypt");

const saltRounds = 10;
const User = require("../models/user"); // conectarme a modelo usuario

const {
  isNotFFilled,
  isUserLoggedIn
} = require("../MiddleWares/authMiddleWares");

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.get("/signup", (req, res, next) => {
  res.render("auth/signup"); // aqui es donde me envia el res respuesta del servidor
}); // parametro de lo q se busca y luego el arrow function de como lo gestiona

router.post("/login", isNotFFilled, async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  try {
    if (user) {
      if (bcrypt.compareSync(password, user.hashedPassword)) {
        req.session.currentUser = user;
        res.redirect("/private");
      } else {
        req.flash("error", "user y password incorrect");
        res.redirect("login");
      }
    } else {
      req.flash("error", "user and password do not exist");
      res.redirect("login");
    }
  } catch (error) {
    next(error);
  }
});

// para matar un puerto  fuser -n tcp 3000
// que servicio esta activo
// kill -9 numero de servicio

router.post("/signup", isNotFFilled, async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username }); // busco si hay coincidencia de nombre trabajo con mongoose
  try {
    if (user) {
      req.flash("error", "user already exists");
      res.redirect("signup");
    } else {
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);
      await User.create({ username, hashedPassword });
      req.flash("info", username); // nos muestre un mensaje del nombre del usuario cuando se crea. pendienteThor?
      res.redirect("created");
    }
  } catch (error) {
    req.flash("error", "error try again");
    res.redirect("/signup");
  }
});

router.get("/private", isUserLoggedIn, (req, res, next) => {
  const { username } = req.body;
  req.flash("info", `Hello User ${username}`);
  res.render("authorized/private");
});

router.get("/created", (req, res, next) => {
  res.render("created", { infoMessages: req.body.username });
});

router.get("/logout", (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      next(err);
    }
    res.redirect("/login");
  });
});

module.exports = router;
