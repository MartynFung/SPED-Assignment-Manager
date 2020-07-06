const router = require('express').Router();

router.use('/api/todos', require('./todos'));
router.use('/api/users', require('./users'));
router.use('/api/teachers', require('./teachers'));

module.exports = router;
