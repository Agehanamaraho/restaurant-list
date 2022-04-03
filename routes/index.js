const express = require('express')
const home = require('./modules/home')
const restaurants = require('./modules/restaurants')
const users = require('./modules/users')

const router = express.Router()

router.use('/', home)
router.use('/restaurants', restaurants)
router.use('/users', users)

module.exports = router