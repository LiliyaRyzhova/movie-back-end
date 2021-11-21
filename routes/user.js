const router = require('express').Router();

const { getUser, updateUser, checkToken, getCurrentUser } = require('../controllers/user');

const { validateUserUpdate } = require('../middlewares/validation');

router.get('/users/me', getUser);
router.get('/users/me', checkToken);
router.get('/users/me/:userId', getCurrentUser);
router.patch('/users/me', validateUserUpdate, updateUser);

module.exports = router;
