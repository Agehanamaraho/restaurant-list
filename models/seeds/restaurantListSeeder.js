const bcrypt = require('bcryptjs')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const User = require('../user')
const Restaurant = require('../restaurant')
const restaurantList = require('../../restaurant.json')
const db = require('../../config/mongoose')

const SEED_USER = [
  {
    name: 'user1',
    email: 'user1@example.com',
    password: '12345678',
    restaurants: restaurantList.results.slice(0, 3)
  },{
    name: 'user2',
    email: 'user2@example.com',
    password: '12345678',
    restaurants: restaurantList.results.slice(3, 6)
  }
]

db.once('open', () => {
  return Promise.all(Array.from(SEED_USER, (SEED_USER) => {
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(SEED_USER.password, salt))
      .then(hash => User.create({
        name: SEED_USER.name,
        email: SEED_USER.email,
        password: hash
      }))
      .then(user => {
        return Promise.all(Array.from(SEED_USER.restaurants, (restaurant) => {
          restaurant.userId = user._id
          return Restaurant.create(restaurant)
        }))
      })      
  }))
  .then(() => {
    console.log('done')
    process.exit()
  })   
})
