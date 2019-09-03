const express = require('express');
const router = express.Router();

/* GET home page. */
// wanted to try async await
router.get('/', async (req, res, next) => {
  try {
    const user = await req.session.currentUser;
    res.render('index', {user});
  } catch (error) {
    next(error);
  }
});

module.exports = router;
