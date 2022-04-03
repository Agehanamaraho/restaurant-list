const express = require('express')
const User = require('../../models/user')
const passport = require('passport')
const router = express.Router()

router.get('/signin', (req, res) => {
  res.render('signin')
})

router.post('/signin', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/signin'
}))

router.get('/signup', (req, res) => {
  res.render('signup')
})

router.post('/signup', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  
  User.findOne({ email })
    .then(user => {
      if(user) {
        res.render('signup', { name, email, password, confirmPassword })
      } else {
        User.create({ name, email, password })
          .then(() => res.redirect('/'))
          .catch(error => console.log(error))
      }
    })
    .catch(error => console.log(error))
})

router.get('/signout', (req, res) => {
  req.logout()
  res.redirect('/users/signin')
})

module.exports = router