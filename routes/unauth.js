const router = require('express').Router();

const { clearCookie } = require('../controllers/user');

router.post('/signout', clearCookie);

module.exports = router;