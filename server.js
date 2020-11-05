// DEPENDENCIES//
const express = require('express')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const session = require('express-session');

// CONFIGURATION//
require('dotenv').config()

const app = express()
const db = mongoose.connection
// Allow use of Heroku's port or your own local port, depending on the environment
const PORT = process.env.PORT || 3000;
//connect to the database either via heroku or locally
const mongodbURI = process.env.MONGODBURI || 'mongodb://localhost:27017/'+ `records_auth`;

// MIDDLEWARE//
app.use(express.static('public')); //use public folder for static assets
app.use(methodOverride('_method')) // allow POST, PUT and DELETE from a form
// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: true })) // extended: false - does not allow nested objects in query strings

app.use(
  session({
    secret: process.env.SECRET, //a random string do not copy this value or your stuff will get hacked
    resave: false, // default more info: https://www.npmjs.com/package/express-session#resave
    saveUninitialized: false // default  more info: https://www.npmjs.com/package/express-session#resave
  })
)

//MONGO DB DATA BASE//
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
  db.on('error', (err) => console.log(err.message + ' is mongod not running?'))
  db.on('connected', () => console.log('mongo connected: ', mongodbURI))
  db.on('disconnected', () => console.log('mongo disconnected'))

  // open the connection to mongo
db.on('open' , ()=>{});

// Controllers//
const recordsController = require('./controllers/records_controller.js')
app.use('/records', recordsController)

const usersController = require('./controllers/users_controller.js')
app.use('/users', usersController)

const sessionsController = require('./controllers/sessions_controller.js')
app.use('/sessions', sessionsController)

// Routes//
app.get('/', (req, res) => {
    res.redirect('/records')
  })

// Listener//
app.listen(PORT, () => {
    console.log('🎸 Listening on port 🎹', PORT)
  })