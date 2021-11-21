require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
// const { createUser, login } = require('./controllers/user');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/NotFoundError');

const app = express();

const { PORT = 3000, MONGO_URI = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

app.use(cors({
  origin: ['http://localhost:3000', 'http://api.movie.nomoredomains.monster', 'http://movie.rls.nomoredomains.rocks', 'https://movie.rls.nomoredomains.rocks', 'https://api.nomoreparties.co/beatfilm-movies', 'http://api.nomoreparties.co/beatfilm-movies'],
  credentials: true,
}));

app.use(helmet());
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(MONGO_URI);

app.use(requestLogger);

app.use(require('./routes/auth'));
app.use(auth, require('./routes/user'));
app.use(auth, require('./routes/movie'));
app.use(auth, require('./routes/unauth'));

app.use('*', auth, () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.use(errorLogger);
app.use(errors());

app.use = (err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
    return;
  }
  res.status(500).send({ message: `На сервере произошла ошибка: ${err.message}` });
  next();
};

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
