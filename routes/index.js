const express = require('express')
const home = require('./modules/home')
const restaurants = require('./modules/restaurants')

const router = express.Router()

router.use('/', home)
router.use('/restaurants', restaurants)

module.exports = router