const express = require("express");
const router = express.Router();
const bcrypt =require('bcrypt')

// Added the model

const User = require("../models/User");

module.exports = router;