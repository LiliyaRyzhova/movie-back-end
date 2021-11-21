const router = require('express').Router();

const { getUser, updateUser, checkToken, getCurrentUser } = require('../controllers/user');

const { validateUserUpdate } = require('../middlewares/validation');

router.get('/users/me', getUser);
router.get('/user/me', checkToken);
router.get('/user/me/:userId', getCurrentUser);
router.patch('/users/me', validateUserUpdate, updateUser);

module.exports = router;
