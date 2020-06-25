const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../config/database');
const passport = require('passport');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, password2 } = req.body;
    console.log({
      name,
      email,
      password,
      password2,
    });

    const errors = [];

    // Form validation
    if (!name || !email || !password || !password2) {
      errors.push({ message: 'Please enter all fields' });
    }
    if (password.length < 6) {
      errors.push({ message: 'Password should be at least 6 characters' });
    }
    if (password != password2) {
      errors.push({ message: 'Passwords do not match' });
    }
    if (errors.length > 0) {
      // TODO: return errors array and rerender register page
      console.log('There are errors: ', { errors });
    } else {
      // Form validation has passed
      let hashedPassword = await bcrypt.hash(password, 10);
      console.log({ hashedPassword });

      const existingEmail = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email.toLowerCase()],
        (err, results) => {
          if (err) {
            throw err;
          }
          console.log('results.rows', results.rows);

          if (results.rows.length > 0) {
            errors.push({ message: 'Email already registered' });
            console.log('There are errors: ', { errors });
          } else {
            `INSERT INTO users(name, email, password)
            VALUES ($1, $2, $3)
            RETURNING id, password`,
              [name, email, hashedPassword],
              (err, results) => {
                if (err) {
                  throw err;
                }
                console.log(results.rows);
                //req.flash('success_msg', "You are now registered. Please log in");
                //res.redirect("/users/login");
              };
          }
        }
      );
    }

    res.end();
  } catch (err) {
    console.error(err.message);
  }
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/users/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true,
  })
);

router.get('/logout', (req, res) => {
  req.logOut();
  req.flash('success_msg', 'You have logged out');
  //res.redirect('/users/login')
});

module.exports = router;
