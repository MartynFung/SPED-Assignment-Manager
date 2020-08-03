const router = require('express').Router();
const pool = require('../config/database');
const auth = require('../middleware/auth');

// Get all teachers
router.get('/', auth, async (req, res) => {
  try {
    const sql = 'SELECT teacher_id, first_name, last_name, email FROM teacher';
    const allTeachers = await pool.query(sql);
    res.json(allTeachers.rows);
  } catch (err) {
    return res.status(400).json({ msg: err.message });
  }
});

// Get a teacher by id
router.get('/:id', auth, async (req, res) => {
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
    return res.status(400).json({ msg: err.message });
  }
});

// Create a teacher
router.post('/', auth, async (req, res) => {
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
    return res.json(newTeacher.rows[0]);
  } catch (err) {
    return res.status(400).json({ msg: err.message });
  }
});

// Update a teacher
router.put('/', auth, async (req, res) => {
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
    return res.status(400).json({ msg: err.message });
  }
});

// Delete a teacher
router.delete('/:id', auth, async (req, res) => {
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
    return res.status(400).json({ msg: err.message });
  }
});

module.exports = router;
