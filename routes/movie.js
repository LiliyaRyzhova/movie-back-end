const router = require('express').Router();

const { getMovies, createMovie, deleteMovie } = require('../controllers/movie');

const { validateMovie, validateId } = require('../middlewares/validation');

router.get('/movies', getMovies);
router.post('/movies', validateMovie, createMovie);
router.delete('/movies/:id', validateId, deleteMovie);

module.exports = router;
