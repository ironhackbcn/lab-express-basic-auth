const express = require("express");
const router = express.Router();
 
//renderiz ala plantilla home.hbs
router.get("/", (req, res, next) => {
  res.render("home");
});


// verificamiso si el usuario tiene una session activa, de ser asi, lo redirigimos a la siguiente ruta
// en este caso, /secret, en caso contrario redirigimos al usuario a /login
router.use((req, res, next) => {
  if (req.session.currentUser) { // <== if there's user in the session (user is logged in)
    next(); // ==> go to the next route 
  } else {                          
    res.redirect("/login");        
  }                                
});    

// renderizamos la plantilla secret.hbs con el username , deconstruimos en la variable username el username de request
// session de currentUser
   
router.get("/private", (req, res, next) => {
  const {username} = req.session.currentUser
  res.render("secret", {username});
});

module.exports = router;