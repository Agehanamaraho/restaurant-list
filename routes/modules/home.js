const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

router.get('/', (req, res) => {
  const userId = req.user._id
  Restaurant.find({ userId })
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log('error'))
})

router.get('/search', (req, res) => {
  const userId = req.user._id
  const keyword = req.query.keyword.trim()
  Restaurant.find({ userId })
    .lean()
    .then(restaurants => {
      const searchResult = restaurants.filter(restaurant => {
        return restaurant.name.toLowerCase().includes(keyword.toLowerCase()) || restaurant.category.includes(keyword.toLowerCase())
      })
      res.render('index', { restaurants: searchResult, keyword: keyword })
    })
    .catch(error => console.log(error))
})

router.get('/sort/:type', (req, res) => {
  const userId = req.user._id
  const type = req.params.type
  Restaurant.find({ userId })
    .lean()
    .sort(type)
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log('error'))
})

module.exports = router