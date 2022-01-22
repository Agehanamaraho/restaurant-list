//package used in this project
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json')

mongoose.connect('mongodb://localhost/restaurant_list')

const db = mongoose.connection

db.on('error', () => console.log('mongodb error'))
db.once('open', () => console.log('mongodb connected'))

//setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//setting static files
app.use(express.static('public'))

//setting routers
app.get('/', (req, res) => {
  res.render('index', { restaurants: restaurantList.results })
})

app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant = restaurantList.results.find(restaurant => {
    return restaurant.id.toString() === req.params.restaurant_id
  })
  res.render('show', { restaurant: restaurant })
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim().toLowerCase()
  const restaurants = restaurantList.results.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(keyword) || restaurant.category.includes(keyword)
  })
  res.render('index', { restaurants: restaurants })
})

app.listen(3000, () => {
  console.log('Express is listening on localhost:3000')
})
