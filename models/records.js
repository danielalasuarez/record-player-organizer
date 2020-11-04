const mongoose = require('mongoose')

const recordSchema = new mongoose.Schema({
  artist: { type: String, required: true },
  albumName: { type: String, required: true },
  releaseDate: { type: String, required: true },
  label: { type: String, required: true },
  coverArt: { type: String, required: true },
  tracklist: [
    {
        number: Number,
        name: String,
        duration: String
    }
],
readyToShip: Boolean
})

const Record = mongoose.model('Record', recordSchema)

module.exports = Record