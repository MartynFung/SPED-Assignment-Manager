const router = require('express').Router();
const Utils = require('../lib/utils');
const pool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

router.get('/protected', auth, (req, res) => {
  console.log('hitting protected route');
  res.json(req.user);
});

// TODO replace local array with redis cache for refresh tokens
const refreshTokens = [];

// User refresh token to get new token
router.post('/token', (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = Utils.generateAccessToken(user);
    res.json({ accessToken: accessToken });
  });
});

// @route POST api/auth/logout
// @desc logout and remove refresh token
// @access Public
router.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

// @route POST api/auth/login
// @desc Auth user
// @access Public
router.post('/login', async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: 'Some values are missing' });
  }

  if (!Utils.isValidEmail(req.body.email)) {
    return res
      .status(400)
      .json({ message: 'Please enter a valid email address' });
  }

  try {
    const sqlQuery = 'SELECT * FROM user_base WHERE email = $1 LIMIT 1';
    const { rows } = await pool.query(sqlQuery, [req.body.email]);
    const user = rows[0];

    if (!user) return res.status(400).send('User does not exist');

    const isValid = await bcrypt.compare(req.body.password, user.password_hash);

    if (isValid) {
      const payload = Utils.generatePayload(user);
      const accessToken = Utils.generateAccessToken(payload);
      const refreshToken = Utils.generateRefreshToken(payload);

      // TODO replace local array with redis cache for refresh tokens
      refreshTokens.push(refreshToken);

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
    } else {
      return res.status(500).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).json(error);
  }
});

module.exports = router;
