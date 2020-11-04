const express = require('express')
const Record = require('../models/records.js')
const records = express.Router()

//MIDDLEWARE

const isAuthenticated = (req, res, next) => {
    if (req.session.currentUser) {
      return next()
    } else {
      res.redirect('/sessions/new')
    }
  }


  //ROUTES

  //NEW
  records.get('/new', (req, res) => {
    res.render(
      'records/new.ejs', {
        currentUser: req.session.currentUser //give access to the user
    })
  })

  //EDIT
  records.get('/:id/edit', (req, res) => {
    Record.findById(req.params.id, (error, foundRecord) => {
      res.render('records/edit.ejs', {
        record: foundRecord,
        currentUser: req.session.currentUser
      })
    })
  })

  //DELETE
  records.delete('/:id', (req, res) => {
    Record.findByIdAndRemove(req.params.id, (err, deletedRecord) => {
      res.redirect('/records')
    })
  })

  //SHOW
  records.get('/:id', (req, res) => {
    Record.findById(req.params.id, (error, foundRecord) => {
      res.render('records/show.ejs', {
        record: foundRecord,  
        currentUser: req.session.currentUser
      })
    })
  })

  //UPDATE
  records.put('/:id', isAuthenticated, (req, res) => {
    if (req.body.readyToShip === 'on') {
      req.body.readyToShip = true
    } else {
      req.body.readyToShip = false
    }
    Record.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
      (error, updatedModel) => {
        res.redirect('/records')
      }
    )
  })

  //CREATE
  records.post('/', (req, res) => {
    if (req.body.readyToShip === 'on') {
      req.body.readyToShip = true
    } else {
      req.body.readyToShip = false
    }
    Record.create(req.body, (error, createdRecord) => {
      res.redirect('/records')
    })
  })

  //INDEX
  records.get('/', (req, res) => {
    Record.find({}, (error, allRecords) => {
      res.render('records/index.ejs', {
        records: allRecords,
        currentUser: req.session.currentUser
      })
    })
  })


  // SEED ROUTE
  records.get('/setup/seed', (req, res) => {
    Record.create(
      [
        {
          artist: 'The Beatles',
          albumName: 'Abbey Road',
          releaseDate: 'September 1969',
          label: 'Apple Records',
          coverArt: 'TBD',
          tracklist: [
            {
                number: 1,
                name: 'Come Together',
            },
            {
                number: 2,
                name: 'Something',
            },
            {
                number: 3,
                name: 'Oh! Darling',
            },
            {
                number: 4,
                name: 'Here Comes the Sun',
            },
          ],
          readyToShip: true
        },
        {
            artist: 'Pink Floyd',
            albumName: 'The Dark Side of the Moon',
            releaseDate: 'March 1973',
            label: 'Harvest Records',
            coverArt: 'TBD',
            tracklist: [
              {
                  number: 1,
                  name: 'On the Run',
              },
              {
                  number: 2,
                  name: 'Time',
              },
              {
                  number: 3,
                  name: 'Brain Damage',
              },
              {
                  number: 4,
                  name: 'Eclipse',
              },
            ],
            readyToShip: true
          }
      ],
      (error, data) => {
        res.redirect('/records')
      }
    )
  })


  // Drop DB Route
records.get(
    '/dropdatabase/cannotundo/areyoursure/reallysure/okthen',
    (req, res) => {
      Records.collection.drop()
      res.send('You did it! You dropped the database!')
    }
  )

  module.exports = records