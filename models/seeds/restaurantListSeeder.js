const Restaurant = require('../restaurant')
const restaurantList = require('../../restaurant.json')
const db = require('../../config/mongoose')

db.once('open', () => {
  console.log('mongodb connected')
  Restaurant.create(restaurantList.results)
})
