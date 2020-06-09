const express = require('express');

const app = express();

app.get('/api/students', (req, res) => {
  const students = [
    { id: 1, firstName: 'Jon', lastName: 'Doe' },
    { id: 2, firstName: 'Steve', lastName: 'Smith' },
    { id: 3, firstName: 'Mary', lastName: 'Swanson' },
  ];

  res.json(students);
});

const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
