const router = require('express').Router();

router.use('/api/users', require('./users'));
router.use('/api/auth', require('./auth'));
router.use('/api/teachers', require('./teachers'));

module.exports = router;
