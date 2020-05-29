// Import Modules
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  name: {
    type: 'String',
  },
  year: {
    type: 'Number',
  },
  runtime: {
    type: 'Number',
  },
  categories: {
    type: ['String'],
  },
  'release-date': {
    type: 'String',
  },
  director: {
    type: mongoose.Schema.Types.Mixed,
  },
  writer: {
    type: ['String'],
  },
  actors: {
    type: ['String'],
  },
  storyline: {
    type: 'String',
  },
});

// CREATE EXPORT MODEL
const Movie = mongoose.model('Movie', movieSchema);

// EXPORT THIS MODULE
module.exports = Movie;
