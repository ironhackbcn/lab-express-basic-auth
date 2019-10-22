const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require("../models/User");

const bcryptSalt = 10;

// Added the model
router.get('/signup', (req, res, next)=>{
  res.render('./auth/signup')
})
router.post('/signup',(req, res, next)=>{
  const {username, password} = req.body;

  if(username === '' || password === ''){
    res.render('./auth/signup', { errorMessage: 'Enter a valid username/password' })
    return;
  }
  
  User.findOne({username: username})
    .then(user =>{
      if(user){
        res.render('./auth/signup', { errorMessage: 'The username alredy exists try another one' })
        return;
      }
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({username, password: hashPass})
        .then(()=>{
          res.redirect('/auth/login')
        })
        .catch(err => console.log(err))
      
    })

})

router.get('/login', (req, res, next)=>{
  res.render('./auth/login')
})

router.post('/login', (req, res, next)=>{
  const {username, password} = req.body;

  if(username === '' || password === ''){
    res.render('./auth/login', { errorMessage: 'Enter a valid username/password' })
    return;
  }

  User.findOne({username: username})
    .then(user =>{
      if(!user){
        res.render('./auth/login', { errorMessage: 'The user dosen\'t exist' })
        return;
      }

      if(bcrypt.compareSync(password, user.password)){
        req.session.currentUser = username;
        res.redirect('/private/main')
      } else {
        res.render('./auth/login', { errorMessage: 'Incorrect password' })
        return;
      }  
    })
    .catch(err=> console.log(err))

})

module.exports = router;