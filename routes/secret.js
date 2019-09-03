const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);                           

/* GET secret page once checked */
router.get("/", async (req, res, next) => {
  try {
    const user = await req.session.currentUser;
    if (user){
      res.render("secret", { user });
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;