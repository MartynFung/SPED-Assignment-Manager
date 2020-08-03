const router = require('express').Router();
const Utils = require('../lib/utils');
const pool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

const getUserQuery = `
  SELECT ub.email,
    ub.user_base_id,
    ub.password_hash,
    p.first_name,
    p.last_name
  FROM user_base AS ub
  LEFT JOIN person AS p ON ub.person_id = p.person_id
  WHERE ub.email = $1 LIMIT 1`;

router.get('/protected', auth, (req, res) => {
  console.log('hitting protected route');
  res.json(req.user);
});

// TODO replace local array with redis cache for refresh tokens
const refreshTokens = [];

// Use refresh token to get new token
router.post('/token', (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (refreshToken === null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = Utils.generateAccessToken(user);
    res.json({ accessToken: accessToken });
  });
});

// @route POST api/auth/logout
// @desc Logout and remove refresh token
// @access Public
router.delete('/logout', async (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  return res.status(204).json({});
});

// @route POST api/auth/login
// @desc Auth user
// @access Public
router.post('/login', async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ msg: 'Some values are missing' });
  }

  if (!Utils.isValidEmail(req.body.email)) {
    return res.status(400).json({ msg: 'Please enter a valid email address' });
  }

  try {
    const { rows } = await pool.query(getUserQuery, [req.body.email]);
    const user = rows[0];

    if (!user) return res.status(400).send('User does not exist');

    const isValid = await bcrypt.compare(req.body.password, user.password_hash);

    if (isValid) {
      const payload = Utils.generatePayload(user);
      const accessToken = Utils.generateAccessToken(payload);
      const refreshToken = Utils.generateRefreshToken(payload);

      // TODO replace local array with redis cache for refresh tokens
      refreshTokens.push(refreshToken);

      const { email, first_name, last_name, user_base_id } = user;
      return res.status(200).json({
        user: {
          email,
          first_name,
          last_name,
          user_base_id,
        },
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    } else {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    return res.status(401).json({ msg: err.message });
  }
});

// @route POST api/auth/register
// @desc register new user
// @access Public
router.post('/register', async (req, res) => {
  console.log('req.body', req.body);
  if (
    !req.body.email ||
    !req.body.first_name ||
    !req.body.last_name ||
    !req.body.password
  ) {
    return res.status(400).json({ msg: 'Some values are missing' });
  }

  if (!Utils.isValidEmail(req.body.email)) {
    return res.status(400).json({ msg: 'Please enter a valid email address' });
  }

  try {
    // Check if user already exists
    const data = await pool.query(
      `SELECT * FROM user_base AS ub WHERE ub.email = $1`,
      [req.body.email]
    );
    const existingUser = data.rows[0];
    console.log({ existingUser });

    if (existingUser) {
      return res
        .status(400)
        .json({ msg: 'User with that email already exists' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const registerQuery = `CALL public.register_user($1, $2, $3, $4)`;
    const values = [
      req.body.email,
      hashedPassword,
      req.body.first_name,
      req.body.last_name,
    ];

    // Create user in DB
    await pool.query(registerQuery, values);

    const { rows } = await pool.query(getUserQuery, [req.body.email]);
    const newUser = rows[0];

    const payload = Utils.generatePayload(newUser);
    const accessToken = Utils.generateAccessToken(payload);
    const refreshToken = Utils.generateRefreshToken(payload);

    // TODO replace local array with redis cache for refresh tokens
    refreshTokens.push(refreshToken);

    const { email, first_name, last_name, user_base_id } = newUser;
    return res.status(200).json({
      user: {
        email,
        first_name,
        last_name,
        user_base_id,
      },
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (err) {
    console.log('Error creating user');
    return res.status(400).json(err.message);
  }
});

// Get user using accessToken. req.user comes from the token payload and is decoded in middleware
router.get('/user', auth, async (req, res) => {
  try {
    console.log('getting /user req.user', req.user);
    const sqlQuery = `
    SELECT ub.email,
      ub.user_base_id,
      ub.password_hash,
      p.first_name,
      p.last_name
    FROM user_base AS ub
    LEFT JOIN person AS p ON ub.person_id = p.person_id
    WHERE ub.user_base_id = $1 LIMIT 1`;

    const { rows } = await pool.query(sqlQuery, [req.user.id]);
    const user = rows[0];
    if (!user) throw Error('User does not exist');
    console.log({ user });
    const { email, first_name, last_name, user_base_id } = user;
    return res.status(200).json({
      user: {
        email,
        first_name,
        last_name,
        user_base_id,
      },
    });
  } catch (err) {
    return res.status(400).json({ msg: err.message });
  }
});

module.exports = router;
