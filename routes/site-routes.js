const express = require("express");
const router = express.Router();

//renderiza la pantalla home.hbs:
/* router.get("/", (req, res, next) => {
  res.render("home");
}); */

// MIDDLEWARE/ Verificamos si el usuario tiene una session activa, de ser asi lo redirigimos en la siguiente ruta en este caso /secret
//en caso contario, redirigimos al usario a /login:

router.use((req, res, next) => {
  if (req.session.currentUser) { // <== if there's user in the session (user is logged in)
    next(); // ==> go to the next route 
  } else {                          
    res.redirect("/auth/login");        
  }                                
});                       
   
//renderizamos la plantilla secret.hbs 
//descontruimos en la variable username el username de req.session.currentUser
router.get("/secret", (req, res, next) => {
  const {username} = req.session.currentUser
  res.render("secret", {username});
});

module.exports = router;