const Movie = require('../models/movie');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,

  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    owner: req.user._id,
    movieId,

  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Некорректные данные');
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  const { id } = req.params;
  const currentUser = req.user._id;
  Movie.findById(id)
    .then((movie) => {
      const owner = movie.owner.toString();
      if (owner !== currentUser) {
        next(new ForbiddenError('Недостаточно прав для удления фильма'));
      }
      return movie;
    })
    .then((movie) => {
      Movie.findOneAndRemove({ _id: movie._id })
        .then((userMovie) => {
          res.send(userMovie);
        })
        .catch(next);
    })
    .catch(() => {
      next(new NotFoundError('Фильм не найден'));
    });
};
