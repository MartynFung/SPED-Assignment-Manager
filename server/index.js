const express = require('express');
const path = require('path');
const app = express();
const pool = require('./dbConfig');
const { port } = require('../envConfig');

const users = require('./routes/users');
const todos = require('./routes/todos');

app.use(express.json()); // req.body
app.use(express.urlencoded({ extended: false }));

// Routes must be defined AFTER all configurations
app.use('/api/users', users);
app.use('/api/todos', todos);

// ROUTES

// students
app.get('/api/students', (req, res) => {
  const students = [
    { id: 1, firstName: 'Jon', lastName: 'Doe' },
    { id: 2, firstName: 'Steve', lastName: 'Smith' },
    { id: 3, firstName: 'Mary', lastName: 'Swanson' },
  ];

  res.json(students);
});

const PORT = port || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// All remaining requests return the React app, so it can handle routing.
// app.get('*', function (request, response) {
//   response.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
// });
