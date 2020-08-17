const router = require('express').Router();
const Utils = require('../lib/utils');
const pool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authToken = require('../middleware/authToken');
const authRole = require('../middleware/authRole');
const { ROLE } = require('../lib/roles');

const getUserQuery = `
  SELECT ub.email,
    ub.user_base_id,
    ub.password_hash,
    p.first_name,
    p.last_name
  FROM user_base AS ub
  LEFT JOIN person AS p ON ub.person_id = p.person_id
  WHERE ub.email = $1 LIMIT 1`;

const userRolesQuery = `
  SELECT ar.role_name
  FROM user_base AS ub
  JOIN user_base_role AS ubr
    ON ub.user_base_id = ubr.user_base_id
  JOIN app_role AS ar
    ON ubr.app_role_id = ar.app_role_id
  WHERE ub.user_base_id = $1`;

router.get('/protected', authToken, (req, res, next) => {
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
router.post('/login', async (req, res, next) => {
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

    let userRoles = await getUserRoles(user.user_base_id);

    user.roles = userRoles;

    if (isValid) {
      const payload = Utils.generatePayload(user);
      const accessToken = Utils.generateAccessToken(payload);
      const refreshToken = Utils.generateRefreshToken(payload);

      // TODO replace local array with redis cache for refresh tokens
      refreshTokens.push(refreshToken);

      const { email, first_name, last_name, user_base_id, roles } = user;
      return res.status(200).json({
        user: {
          email,
          first_name,
          last_name,
          user_base_id,
          roles,
        },
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    } else {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
  } catch (err) {
    return next(err);
  }
});

// @route POST api/auth/register
// @desc register new user
// @access Public
router.post('/register', async (req, res, next) => {
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
    const userData = await pool.query(
      `SELECT * FROM user_base AS ub WHERE ub.email = $1`,
      [req.body.email]
    );
    const existingUser = userData.rows[0];

    if (existingUser) {
      return res
        .status(400)
        .json({ msg: 'User with that email already exists' });
    }

    // Salts and hashes password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // 8/17 currently when registering, user has no default roles
    // TODO: add default role when creating new user
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

    let userRoles = await getUserRoles(newUser.user_base_id);
    newUser.roles = userRoles;

    const payload = Utils.generatePayload(newUser);
    const accessToken = Utils.generateAccessToken(payload);
    const refreshToken = Utils.generateRefreshToken(payload);

    // TODO replace local array with redis cache for refresh tokens
    refreshTokens.push(refreshToken);

    const { email, first_name, last_name, user_base_id, roles } = newUser;
    return res.status(200).json({
      user: {
        email,
        first_name,
        last_name,
        user_base_id,
        roles,
      },
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (err) {
    return next(err);
  }
});

// Get user using accessToken. req.user comes from the token payload and is decoded in middleware
router.get('/user', authToken, async (req, res, next) => {
  try {
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

    let userRoles = await getUserRoles(req.user.id);
    user.roles = userRoles;

    const { email, first_name, last_name, user_base_id, roles } = user;
    return res.status(200).json({
      user: {
        email,
        first_name,
        last_name,
        user_base_id,
        roles,
      },
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

const getUserRoles = async (user_base_id) => {
  try {
    const roleData = await pool.query(userRolesQuery, [user_base_id]);
    let userRoles = [];
    if (roleData.rows) {
      userRoles = roleData.rows.map((row) => row.role_name);
    }
    return userRoles;
  } catch {
    return res.status(500).json({ msg: err.message });
  }
};
