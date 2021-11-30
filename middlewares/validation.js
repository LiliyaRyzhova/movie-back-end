const { celebrate, Joi, CelebrateError } = require('celebrate');
const validator = require('validator');

const urlValidation = (value) => {
  if (!validator.isURL(value)) {
    throw new CelebrateError('Некорректный URL');
  }
  return value;
};

const validateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(100),
    director: Joi.string().required().min(2).max(100),
    duration: Joi.number().required(),
    year: Joi.string().required().min(4).max(4),
    description: Joi.string().required().min(2).max(2000),
    image: Joi.string().required().custom(urlValidation),
    trailer: Joi.string().required().custom(urlValidation),
    nameRU: Joi.string().required().min(2).max(100),
    nameEN: Joi.string().required().min(2).max(100),
    thumbnail: Joi.string().required().custom(urlValidation),
    movieId: Joi.number().required(),
  }),
});

const validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex(),
  }),
});

const validateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
    password: Joi.string().required().min(8),
  }),
});

const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports = {
  validateMovie,
  validateId,
  validateUser,
  validateUserUpdate,
  validateLogin,
};
