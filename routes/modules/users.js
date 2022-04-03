const express = require('express')
const router = express.Router()

const User = require('../../models/user')

router.get('/signin', (req, res) => {
  res.render('signin')
})

router.post('/signin', (req, res) => {
  res.redirect('/')
})

router.get('/signup', (req, res) => {
  res.render('signup')
})

router.post('/signup', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  
  User.findOne({ email })
    .then(user => {
      if(user) {
        res.render('/signup', { name, email, password, confirmPassword })
      } else {
        User.create({ name, email, password })
          .then(() => res.redirect('/'))
          .catch(error => console.log(error))
      }
    })
    .catch(error => console.log(error))
})

module.exports = router