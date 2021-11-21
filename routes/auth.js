const router = require('express').Router();

const { createUser, login } = require('../controllers/user');

const { validateUser, validateLogin } = require('../middlewares/validation');

router.post('/signup', validateUser, createUser);
router.post('/signin', validateLogin, login);

module.exports = router;