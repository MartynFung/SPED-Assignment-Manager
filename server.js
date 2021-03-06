const express = require('express');
const cors = require('cors');
const errorHandler = require('./lib/errorHandler');

// Provides acccess to variables in .env file via 'process.env.VARIABLE_NAME'
require('dotenv').config();

// Create the Express app
const app = express();

// Use Express implementation of body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Allow frontend to make HTTP requests to Express app
app.use(cors());

// Routes must be defined AFTER configurations
// Imports all of the routes from ./routes/index.js
app.use(require('./routes'));

app.get('/api/students', (req, res) => {
  const students = [
    { id: 1, firstName: 'Jon', lastName: 'Doe' },
    { id: 2, firstName: 'Steve', lastName: 'Smith' },
    { id: 3, firstName: 'Mary', lastName: 'Swanson' },
  ];

  res.json(students);
});

// Global error handler
app.use(errorHandler);

// SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
