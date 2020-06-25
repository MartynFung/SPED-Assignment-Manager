const express = require('express');
const cors = require('cors');
const path = require('path');
const passport = require('passport');

// Provides acccess to variables in .env file via 'process.env.VARIABLE_NAME'
require('dotenv').config();

const app = express();
const session = require('express-session');
const flash = require('express-flash');

const initializePassport = require('./passportConfig');
initializePassport(passport);

// Express config
app.use(
  session({
    secret: 'someSecret', // secret key for encrypting session info. TODO: change this key and store in environment variable
    resave: false, // don't resave information if nothing changes
    saveUninitialized: false, // don't save session details if there's no session value
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(flash());
app.use(express.json()); // req.body
app.use(express.urlencoded({ extended: false }));

// Routes must be defined AFTER configurations
const users = require('./routes/users');
const todos = require('./routes/todos');
app.use('/users', users);
app.use('/todos', todos);

// ROUTES

// students
app.get('/students', (req, res) => {
  const students = [
    { id: 1, firstName: 'Jon', lastName: 'Doe' },
    { id: 2, firstName: 'Steve', lastName: 'Smith' },
    { id: 3, firstName: 'Mary', lastName: 'Swanson' },
  ];

  res.json(students);
});

const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/users/dashboard');
  }
  next();
};

const checkNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  console.log('not logged in. Redirect to login page');
  //res.redirect('users/login');
};

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// All remaining requests return the React app, so it can handle routing.
// app.get('*', function (request, response) {
//   response.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
// });
