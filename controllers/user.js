const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError ');
const ConflictError = require('../errors/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const {
    email, name, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, name, password: hash,
    })
      .then((user) => res.status(200).send({
        email: user.email,
        name: user.name,
      }))
      .catch((err) => {
        if (err.name === 'MongoServerError' || err.code === 11000) {
          next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
        }
        if (err.name === 'ValidationError') {
          throw new ValidationError('Некорректные данные');
        } else {
          next(err);
        }
      }))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(200).send(user))
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new ValidationError('Пользователь по указанному _id не найден.');
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Невалидный id ');
      }
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Некорректные данные');
      } else if (err.name === 'MongoError' && err.code === 11000) {
        next(new ConflictError('Такой email уже зарегистрирован'));
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.checkToken = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new ValidationError('Пользователь по указанному _id не найден.');
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Невалидный id ');
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret-test', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true, // запрещает доступ к куке из js
        sameSite: 'None', // разрешает запрос куки с другого домена
        secure: true,
      })
        .send({ token });
    })
    .catch((err) => next(new UnauthorizedError(`Произошла ошибка: ${err.message}`)));
};

module.exports.clearCookie = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    next(new UnauthorizedError('Jwt не найден в Cookies'));
  } else {
    res
      .status(202)
      .clearCookie('jwt', {
        sameSite: 'None',
        secure: true,
      })
      .send({ success: 'Cookies удалены' });
  }
};
