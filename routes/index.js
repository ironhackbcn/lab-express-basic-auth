const express = require("express");
const router = express.Router();
const checkIfLoggedIn = require("../middlewares/auth");

/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("index", { title: "Express" });
});

router.get("/loggedin", checkIfLoggedIn, (req, res, next) => {
  res.render("loggedin", { title: "Express" });
});

module.exports = router;
