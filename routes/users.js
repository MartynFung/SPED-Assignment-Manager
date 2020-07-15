const router = require('express').Router();
const Utils = require('../lib/utils');
const pool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// @route POST api/user/register
// @desc register new user
// @access Public
router.post('/register', async (req, res) => {
  if (
    !req.body.email ||
    !req.body.first_name ||
    !req.body.last_name ||
    !req.body.password
  ) {
    return res.status(400).json({ message: 'Some values are missing' });
  }

  if (!Utils.isValidEmail(req.body.email)) {
    return res
      .status(400)
      .json({ message: 'Please enter a valid email address' });
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const sqlQuery = `INSERT INTO
      user_base(email, password_hash, first_name, last_name)
      VALUES($1, $2, $3, $4)
      returning *`;
    const values = [
      req.body.email,
      hashedPassword,
      req.body.first_name,
      req.body.last_name,
    ];

    // Create user in DB
    const { rows } = await pool.query(sqlQuery, values);
    const user = rows[0];

    const accessToken = Utils.generateAccessToken(user);
    const refreshToken = Utils.generateRefreshToken(user);

    // TODO replace local array with redis cache for refresh tokens
    refreshTokens.push(refreshToken);

    console.log(refreshToken);

    return res.status(200).json({
      user: {
        email: user.email,
        first_name: user.first_name,
        last_names: user.last_name,
        user_base_id: user.user_base_id,
      },
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    if (error.routine === '_bt_check_unique') {
      return res
        .status(400)
        .json({ message: 'User with that EMAIL already exist' });
    }
    return res.status(400).json(error);
  }
});

module.exports = router;
