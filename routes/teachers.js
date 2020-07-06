const router = require('express').Router();
const pool = require('../config/database');
// TODO protect these routes

// Get all teachers
router.get('/', async (req, res) => {
  try {
    const sql = 'SELECT teacher_id, first_name, last_name, email FROM teacher';
    const allTeachers = await pool.query(sql);
    res.json(allTeachers.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Get a teacher by id
router.get('/:id', async (req, res) => {
  try {
    const teacher_id = req.params.id;
    const sql = `
    SELECT teacher_id, first_name, last_name, email 
    FROM teacher
    WHERE teacher_id = $1`;
    const data = await pool.query(sql, [teacher_id]);
    if (data.rows[0]) {
      res.status(200).json(data.rows[0]);
    } else {
      res.status(404).end();
    }
  } catch (err) {
    console.error(err.message);
  }
});

// Create a teacher
router.post('/', async (req, res) => {
  try {
    const { first_name, last_name, email } = req.body;
    if (!first_name || !last_name || !email) {
      return res.status(400).json({ message: 'Some values are missing' });
    }

    const sql = `
    INSERT INTO teacher(first_name, last_name, email)
    VALUES ($1, $2, $3)
    RETURNING teacher_id, first_name, last_name, email`;

    const newTeacher = await pool.query(sql, [first_name, last_name, email]);
    res.json(newTeacher.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Update a teacher
router.put('/', async (req, res) => {
  try {
    const { teacher_id, first_name, last_name, email } = req.body;
    if (!teacher_id || !first_name || !last_name || !email) {
      return res.status(400).json({ message: 'Some values are missing' });
    }
    const sql = `
    UPDATE teacher
    SET 
      first_name = $2,
      last_name = $3,
      email = $4
    WHERE teacher_id = $1`;
    const updateTeacher = await pool.query(sql, [
      teacher_id,
      first_name,
      last_name,
      email,
    ]);
    res.status(200).json('Teacher updated successfully');
  } catch (err) {
    console.error(err.message);
  }
});

// Delete a teacher
router.delete('/:id', async (req, res) => {
  try {
    const teacher_id = req.params.id;
    const sql = `DELETE FROM teacher WHERE teacher_id = $1 RETURNING *`;
    const deleteTeacher = await pool.query(sql, [teacher_id]);
    if (deleteTeacher.rowCount === 0) {
      res.status(404).json('Teacher not found');
    } else {
      res.status(200).json(`Teacher successfully deleted`);
    }
  } catch (err) {
    console.error(err.message);
  }
});

//TODO
// router.get(
//   '/protected',
//   passport.authenticate('jwt', { session: false }),
//   (req, res, next) => {
//     console.log('protected');
//     res.status(200).json({ success: true, message: 'you are authorized' });
//   }
// );

module.exports = router;
