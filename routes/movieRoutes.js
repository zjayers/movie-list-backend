const express = require('express');

const movieController = require('../controllers/movieController');
const router = express.Router();

router.get('/', movieController.getAllMovies);
router.get('/:id', movieController.getMovie);
router.post('/', movieController.createMovie);

module.exports = router;
