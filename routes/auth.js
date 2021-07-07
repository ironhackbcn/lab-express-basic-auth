const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()

const User = require('../models/User')
const saltRounds = 10

router.get('/signup', (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect('/')
    return
  }
  const data = {
    messages: req.flash('validation')
  }
  res.render('auth/signup', data)
})

router.post('/signup', async (req, res, next) => {
  const { username, password } = req.body
  // Comprobar que username y password existen
  if (!password || !username) {
    res.redirect('auth/signup')
    return
  }
  // Comprobar que el usuario existe en la base de datos
  try {
    const result = await User.findOne({ username })
    if (result) {
      req.flash('validation', 'This user name is taken')
      res.redirect('/auth/signup')
      return
    }

    // Encriptar el password
    // Signup user
    const salt = bcrypt.genSaltSync(saltRounds)
    const hashedPassword = bcrypt.hashSync(password, salt)

    // Crear usuario
    const newUser = {
      username,
      password: hashedPassword
    }

    const cratedUser = await User.create(newUser)
    // Guardamos el usuario en la sesión
    req.session.currentUser = cratedUser
    // Redirigimos para homepage
    res.redirect('/')
  } catch (error) {
    next(error)
  }
})

// requireAnon para utilizar el middleware
router.get('/login', async (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect('/')
    return
  }
  const data = {
    messages: req.flash('validation')
  }
  res.render('auth/login', data)
})

router.post('/login', async (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect('/')
    return
  }

  // Extraer información del body
  const { username, password } = req.body
  // Comprobar que hay usuario y contraseña
  if (!password || !username) {
    res.redirect('/auth/login')
    return
  }
  try {
    // Comprobar que el usuario existe
    const user = await User.findOne({ username })
    if (!user) {
      req.flash('validation', 'Username or password incorrect')
      res.redirect('/auth/login')
      return
    }
    // Comparar contraseña
    if (bcrypt.compareSync(password, user.password)) {
      // Guarda la sesión
      req.session.currentUser = user
      // Redirige
      res.redirect('/')
    } else {
      req.flash('validation', 'Username or password incorrect')
      res.redirect('/auth/login')
    }
  } catch (error) {
    next(error)
  }
})

// requireUser para utilizar el middleware
router.post('/logout', async (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect('/')
    return
  }
  delete req.session.currentUser
  res.redirect('/')
})

module.exports = router
