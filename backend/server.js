const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Database SCHOOL-DB
const db = new sqlite3.Database('./SCHOOL-DB.sqlite', (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    // Create STUDENT_TABLE
    db.run(`
      CREATE TABLE IF NOT EXISTS STUDENT_TABLE (
        Roll_No TEXT PRIMARY KEY,
        Full_Name TEXT NOT NULL,
        Class TEXT NOT NULL,
        Birth_Date TEXT NOT NULL,
        Address TEXT NOT NULL,
        Enrollment_Date TEXT NOT NULL
      )
    `);
  }
});

// GET all students
app.get('/api/students', (req, res) => {
  db.all(`SELECT * FROM STUDENT_TABLE`, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ count: rows.length, data: rows });
  });
});

// GET student by Roll No
app.get('/api/students/:id', (req, res) => {
  const id = req.params.id;
  db.get(`SELECT * FROM STUDENT_TABLE WHERE Roll_No = ?`, [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (row) {
      res.json({ exists: true, data: row });
    } else {
      res.json({ exists: false });
    }
  });
});

// POST save new student
app.post('/api/students', (req, res) => {
  const { Roll_No, Full_Name, Class, Birth_Date, Address, Enrollment_Date } = req.body;
  if (!Roll_No || !Full_Name || !Class || !Birth_Date || !Address || !Enrollment_Date) {
      return res.status(400).json({ error: 'All fields are required' });
  }

  const sql = `INSERT INTO STUDENT_TABLE (Roll_No, Full_Name, Class, Birth_Date, Address, Enrollment_Date) VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [Roll_No, Full_Name, Class, Birth_Date, Address, Enrollment_Date];
  
  db.run(sql, params, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: 'Student saved successfully', id: Roll_No });
  });
});

// PUT update existing student
app.put('/api/students/:id', (req, res) => {
  const { Full_Name, Class, Birth_Date, Address, Enrollment_Date } = req.body;
  const Roll_No = req.params.id;

  if (!Full_Name || !Class || !Birth_Date || !Address || !Enrollment_Date) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const sql = `UPDATE STUDENT_TABLE SET Full_Name = ?, Class = ?, Birth_Date = ?, Address = ?, Enrollment_Date = ? WHERE Roll_No = ?`;
  const params = [Full_Name, Class, Birth_Date, Address, Enrollment_Date, Roll_No];
  
  db.run(sql, params, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: 'Student updated successfully', changes: this.changes });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
