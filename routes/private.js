'use strict';

const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    if (req.session.currentUser) {
      return res.render('private-content');
    }
    next();
  } catch (error) {
    next(error);
  }
});
module.exports = router;
