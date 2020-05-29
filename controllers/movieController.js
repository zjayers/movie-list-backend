const Movie = require('./../models/MovieModel');
const factory = require('./handlerFactory');

//* Factory Functions
exports.getAllMovies = factory.getAll(Movie);
exports.getMovie = factory.getOne(Movie);
exports.createMovie = factory.createOne(Movie);
