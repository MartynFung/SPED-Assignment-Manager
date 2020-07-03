const fs = require('fs');
const path = require('path');
const pool = require('../config/database');

const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const pathToKey = path.join(__dirname, '../cryptography', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ['RS256'],
};

// Verify JWT:
// Take jwt from auth header > validate jwt > get userID from payload.sub > get user from DB by ID > passport attaches returned user to the request.user object in the express framework
const strategy = new JwtStrategy(options, async (jwt_payload, done) => {
  try {
    const user = await pool.query('SELECT * FROM users WHERE id = $1 LIMIT 1', [
      jwt_payload.sub,
    ]);
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (err) {
    done(err, null);
  }
});

module.exports = (passport) => {
  passport.use(strategy);
};
