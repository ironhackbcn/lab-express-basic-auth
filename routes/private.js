const express = require('express');
const router  = express.Router();

router.use((req, res, next) => {
  if (req.session.currentUser) { // <== if there's user in the session (user is logged in)
    next(); // ==> go to the next route 
  } else {                          
    res.redirect("../users/signin");        
  }                                
});                       
   
// GET Main page.
router.get('/main', (req, res, next) => {
  const {username} = req.session.currentUser;
  res.render('private/main', {username});
});

// GET Private page.
router.get('/private', (req, res, next) => {
  const {username} = req.session.currentUser;
  res.render('private/private', {username});
});

module.exports = router;