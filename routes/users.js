const router = require('express').Router();
const pool = require('../config/database');

// TODO: remove this route. This was used for testing.
router.get('/', async (req, res) => {
  const users = await pool.query('SELECT * FROM user_base');
  res.status(200).json(users.rows);
});

module.exports = router;
