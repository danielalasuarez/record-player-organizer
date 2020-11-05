// DEPENDENCIES
const express = require('express')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const session = require('express-session');

// CONFIGURATION
require('dotenv').config()

const app = express()
const db = mongoose.connection
const PORT = process.env.PORT
const mongodbURI = process.env.MONGODBURI

// MIDDLEWARE
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }))

app.use(
  session({
    secret: process.env.SECRET, //a random string do not copy this value or your stuff will get hacked
    resave: false, // default more info: https://www.npmjs.com/package/express-session#resave
    saveUninitialized: false // default  more info: https://www.npmjs.com/package/express-session#resave
  })
)

//MONGO DB DATA BASE
mongoose.connect(
    mongodbURI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    },
    () => {
      console.log('the connection with mongod is established at', mongodbURI)
    }
  )

  //error message if mongo not working 
  db.on('error', err => console.log(err.message + ' is mongod not running?'))
  db.on('disconnected', () => console.log('mongo disconnected'))

// Controllers
const recordsController = require('./controllers/records_controller.js')
app.use('/records', recordsController)

const usersController = require('./controllers/users_controller.js')
app.use('/users', usersController)

const sessionsController = require('./controllers/sessions_controller.js')
app.use('/sessions', sessionsController)

// Routes
app.get('/', (req, res) => {
    res.redirect('/records')
  })

// Listener
app.listen(PORT, () => {
    console.log('🎸 Listening on port 🎹', PORT)
  })