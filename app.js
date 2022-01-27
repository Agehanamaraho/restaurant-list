//package used in this project
const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const exphbs = require('express-handlebars')
const Restaurant = require('./models/restaurant')

const app = express()

//setting mongoose
mongoose.connect('mongodb://localhost/restaurant_list')

const db = mongoose.connection

db.on('error', () => console.log('mongodb error'))
db.once('open', () => console.log('mongodb connected'))

//setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

//setting routers
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log('error'))
})

app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log('error'))
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim()
  Restaurant.find()
    .lean()
    .then(restaurants => {
      const searchResult = restaurants.filter(restaurant => {
        return restaurant.name.toLowerCase().includes(keyword.toLowerCase()) || restaurant.category.includes(keyword.toLowerCase())
      })
      res.render('index', { restaurants: searchResult, keyword: keyword })
    })
    .catch(error => console.log(error))
})

app.get('/restaurant/new', (req, res) => {
  res.render('new')
})

app.get('/restaurants/:id/edit', (req,res) => {
  const id = req.params.id
  Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

app.post('/restaurants', (req, res) => {
  const restaurant = req.body
  Restaurant.create(restaurant)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.put('/restaurants/:id', (req, res) => {
  const id = req.params.id
  const newRestaurantData = req.body
  Restaurant.findByIdAndUpdate(id, newRestaurantData)
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

app.delete('/restaurants/:id', (req, res) => {
  const id = req.params.id
  Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.listen(3000, () => {
  console.log('Express is listening on localhost:3000')
})
