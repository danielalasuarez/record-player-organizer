const bcrypt = require('bcrypt');
const express = require('express')
const sessions = express.Router();

const User = require('../models/users.js');

sessions.get('/new', (req, res) => {
    res.render('sessions/new.ejs', { 
      currentUser: req.session.currentUser //give access to the user
    });
  });

  // on sessions form submit (log in)
  sessions.post('/', (req, res) => {
        // Step 1 Look for the username
  User.findOne({ username: req.body.username }, (error, foundUser) => {
    // Database error
    if (error) {
      console.log(error)
      res.send('There was an issue with the DB')
    } else if (!foundUser) {
      // if found user is undefined/null not found etc
      res.send('<a href="/">Sorry, no user found</a>')
    } else {
       // user is found yay!
      // check if passwords match
      if (bcrypt.compareSync(req.body.password, foundUser.password)) {
        // add the user to our session
        req.session.currentUser = foundUser
        // redirect back to our home page
        res.redirect('/records')
      } else {
        // passwords do not match
        res.send('<a href="/"> password does not match </a>')
      }
    }
  })
})

sessions.delete('/', (req, res) => {
    req.session.destroy(() => {
      res.redirect('/records')
    })
  })

  module.exports = sessions