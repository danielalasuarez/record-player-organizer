const mongoose = require('mongoose')

const recordSchema = new mongoose.Schema({
  artist: { type: String, required: true },
  album_name: { type: String, required: true },
  release_date: { type: String, required: true },
  label: { type: String, required: true },
  cover_art: { type: String, required: true },
  img: {type: String, required: true},
  tracklist: [
    {
        number: Number,
        name: String,
        duration: String
    }
]
})

const Record = mongoose.model('Record', recordSchema)

module.exports = Record