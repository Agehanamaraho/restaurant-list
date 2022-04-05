const express = require('express')
const User = require('../../models/user')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const router = express.Router()

router.get('/signin', (req, res) => {
  res.render('signin')
})

router.post('/signin', passport.authenticate('local', {
  successRedirect: '/',
  failureFlash: true,
  failureRedirect: '/users/signin'
}))

router.get('/signup', (req, res) => {
  res.render('signup')
})

router.post('/signup', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []

  if (!email || !password || !confirmPassword) {
    errors.push({ message: '請填寫必填欄位!' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼不相符！' })
  }
  if (errors.length) {
    return res.render('signup', { errors, name, email, password, confirmPassword })
  }

  User.findOne({ email })
    .then(user => {
      if(user) {
        errors.push({ message: '已有此帳號!' })
        return res.render('signup', { errors, name, email, password, confirmPassword })
      }

      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({ name, email, password: hash }))
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
    })
    .catch(error => console.log(error))
})

router.get('/signout', (req, res) => {
  req.logout()
  req.flash('success_msg', '已成功登出!')
  res.redirect('/users/signin')
})

module.exports = router