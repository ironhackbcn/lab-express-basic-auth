const express = require("express");
const router = express.Router();

//Add the model
const User = require("../models/User");

//requerimos bcrypt para encriptar los passwords
const bcrypt = require("bcryptjs");
const bcryptSalt = 10;

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("auth-home");
});


////////////////////SIGNUP//////////////////////////////
//Route del signup:
router.get("/signup", (req, res, next) => {
    res.render("auth/signup");
});

// Recibimos datos del formulario  signup
//genera el salt y hace un hash del password 
//Crea un objeto User y redigire
router.post("/signup", (req, res, next) => {
    const { username, password } = req.body;
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    
    // validamos si los valores de los inputs llegan vacíos
    if (username === "" || password === "") {
    res.render("auth/signup", {
        errorMessage: "The fields can't be empty"
    });
    return;
    }
    
    //busco en la BD si existe el username
    User.findOne({ username: username })
        .then(user => {
          if (user !== null) {
            res.render("auth/signup", {
              errorMessage: "The username can't be repeated!"
            });
            return;
          }
    
          /* const salt = bcrypt.genSaltSync(bcryptSalt);
          const hashPass = bcrypt.hashSync(password, salt); */
    
          User.create({
            username: username,
            password: hashPass
          })
            .then(() => {
              res.redirect("/");
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(error => {
          next(error);
        });
    });

////////////////LOGIN////////////////////
//Route del login:
router.get("/login", (req, res, next) => {
    res.render("auth/login");
});

router.post("/login", (req, res, next) => {

    const theUsername = req.body.username;
    const thePassword = req.body.password;

    if (theUsername === "" || thePassword === "") {
        res.render("auth/login", {
            errorMessage: "Please enter both, username and password to sign up."
    });
        return;
    }
    
// buscamos en la BD si existe un username con los datos del user que vienen del form
// si no lo encuentra, nos dice que el user no existe
// sino, nos devuelve el user
// usamos el método compareSync para hacer hash del form input y compararlo con el password guardado en la BD
    User.findOne({ "username": theUsername })
    .then(user => {
        if (!user) {
            res.render("auth/login", {
                errorMessage: "The username doesn't exist."
        });
            return;
        }

        if (bcrypt.compareSync(thePassword, user.password)) {
            // Save the login in the session!
            //the request object has a property called session where we can add the values we want to store on it. In this case, we are setting it up with the user’s information.
            // session is a cookie to keep the user data cuando esta logeado
            req.session.currentUser = user;
            res.redirect("/site/secret");
        } else {
            res.render("auth/login", {
                errorMessage: "Incorrect password"
            });
        }
    })
    .catch(error => {
        next(error);
    })
});

/////////////////LOG OUT///////////////////////////
//para destrozar la session (methodo de session) porque el usario no hizo nada durante 24h y se borre la session de la BD
router.get("/logout", (req, res, next) => {
    req.session.destroy((err) => {
        // cannot access session here
        res.redirect("/login");
    });
  });
  


module.exports = router;