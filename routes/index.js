const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/User')

const { requireAnon, requireUser, requireFields } = require('../middlewares/auth')

const saltRounds = 10

/* GET home page. */
router.get('/main', requireUser, (req, res, next) => {
  res.render('index', { title: 'Express' })
})

router.get('/private', requireUser, (req, res, next) => {
  res.render('private')
})

router.get('/', requireAnon, (req, res, next) => {
  const data = {
    messages: req.flash('validation')
  }
  res.render('signup', data)
})

router.post('/', requireAnon, requireFields, async (req, res, next) => {
  const { username, password } = req.body

  try {
    const result = await User.findOne({ username })
    if (result) {
      req.flash('validation', 'The user exists')
      res.redirect('/')
      return
    }

    // Encriptar password
    const salt = bcrypt.genSaltSync(saltRounds)
    const hashedPassword = bcrypt.hashSync(password, salt)

    // Crear el user
    const newUser = {
      username,
      password: hashedPassword
    }
    const createdUser = await User.create(newUser)

    req.session.currentUser = createdUser

    res.redirect('/main')
  } catch (error) {
    next(error)
  }
})

router.get('/login', requireAnon, (req, res, next) => {
  const data = {
    messages: req.flash('validation')
  }
  res.render('login', data)
})

router.post('/login', requireAnon, requireFields, async (req, res, next) => {
  const { username, password } = req.body

  try {
    const user = await User.findOne({ username })
    if (!user) {
      req.flash('validation', 'User name or password is incorrect')
      res.redirect('/login')
      return
    }
    if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user
      res.redirect('/main')
    } else {
      req.flash('validation', 'User name or password is incorrect')
      res.redirect('/login')
    }
  } catch (error) {
    next(error)
  }
})

router.post('/logout', (req, res, next) => {
  delete req.session.currentUser
  res.redirect('/')
})

module.exports = router
