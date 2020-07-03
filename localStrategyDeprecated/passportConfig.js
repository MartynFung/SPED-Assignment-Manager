const LocalStrategy = require('passport-local').Strategy;
const { pool } = require('../config/database');
const bcrypt = require('bcrypt');

const initialize = (passport) => {
  const authenticateUser = (email, password, done) => {
    pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email],
      (err, results) => {
        if (err) {
          throw err;
        }
        console.log(results.rows);
        if (results.rows.length > 0) {
          const user = results.rows[0];

          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              throw err;
            }

            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'Password is incorrect' });
            }
          });
        } else {
          return done(null, false, { message: 'Email is not registered' });
        }
      }
    );
  };

  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      authenticateUser
    )
  );

  // Takes user, stores userId in session cookie
  passport.serializeUser((user, done) => done(null, user.id));

  // Takes userId from cookie to retrieve user details from database, store full object in session
  passport.deserializeUser((id, done) => {
    pool.query(`SELECT * FROM users WHERE id = $1`, [id], (err, results) => {
      if (err) {
        throw err;
      }
      return done(null, results.rows[0]);
    });
  });
};

module.exports = initialize;