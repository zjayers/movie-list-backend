const Movie = require('./../models/movieModel');
const factory = require('./handlerFactory');

//* Factory Functions
exports.getAllMovies = factory.getAll(Movie);
exports.getMovie = factory.getOne(Movie);
exports.createMovie = factory.createOne(Movie);
