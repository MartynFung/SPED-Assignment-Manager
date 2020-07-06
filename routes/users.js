const router = require('express').Router();
const passport = require('passport');
const Utils = require('../lib/utils');
const { uuid } = require('uuidv4');
const pool = require('../config/database');

// Get all users
router.get('/', async (req, res) => {
  try {
    const allUsers = await pool.query('SELECT * FROM users');
    res.json(allUsers.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//TODO
router.get(
  '/protected',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    console.log('protected');
    res.status(200).json({ success: true, message: 'you are authorized' });
  }
);

router.post('/login', async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: 'Some values are missing' });
  }

  if (!Utils.isValidEmail(req.body.email)) {
    return res
      .status(400)
      .json({ message: 'Please enter a valid email address' });
  }

  const sqlQuery = 'SELECT * FROM users WHERE email = $1 LIMIT 1';

  try {
    const { rows } = await pool.query(sqlQuery, [req.body.email]);
    const user = rows[0];

    if (!user) {
      return res
        .status(401)
        .json({ message: 'The credentials you provided are incorrect' });
    }

    const isValid = Utils.validatePassword(
      req.body.password,
      user.hash,
      user.salt
    );

    if (isValid) {
      const jwt = Utils.issueJWT(user);
      console.log({ jwt });
      return res.status(200).json({
        success: true,
        user: user,
        token: jwt.token,
        expiresIn: jwt.expires,
      });
    } else {
      return res
        .status(401)
        .json({ message: 'The credentials you provided are incorrect' });
    }
  } catch (error) {
    return res.status(401).json(error);
  }
});

router.post('/register', async (req, res) => {
  if (!req.body.email || !req.body.name || !req.body.password) {
    return res.status(400).json({ message: 'Some values are missing' });
  }

  if (!Utils.isValidEmail(req.body.email)) {
    return res
      .status(400)
      .json({ message: 'Please enter a valid email address' });
  }

  const saltHash = Utils.saltHashPassword(req.body.password);
  const hash = saltHash.hash;
  const salt = saltHash.salt;

  const sqlQuery = `INSERT INTO
      users(id, email, name, hash, salt)
      VALUES($1, $2, $3, $4, $5)
      returning *`;

  const values = [uuid(), req.body.email, req.body.name, hash, salt];

  try {
    const { rows } = await pool.query(sqlQuery, values);
    const user = rows[0];
    const jwt = Utils.issueJWT(user);
    return res.json({
      success: true,
      user: user,
      token: jwt.token,
      expiresIn: jwt.expires,
    });
  } catch (error) {
    if (error.routine === '_bt_check_unique') {
      return res
        .status(400)
        .json({ message: 'User with that EMAIL already exist' });
    }
    return res.status(400).json(error);
  }

  // Save new user in Database
  // newUser
  //   .save()
  //   .then((user) => {
  //     const jwt = utils.issueJWT(user);
  //     res.json({ success: true, user: user, token: jwt.token, expiresIn: jwt.expires});
  //   })
  //   .catch((err) => next(err));
});

module.exports = router;
