const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// MySQL Connection Pool
const db = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '123456789',
  database: 'site_visit_db'
});

// Test Server Route
app.get('/', (req, res) => {
  res.send('Backend server is running');
});

// Login Route
app.post('/api/login', (req, res) => {
  const { login_id, password } = req.body;

  const sql = 'SELECT * FROM users WHERE login_id = ?';
  db.query(sql, [login_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Internal server error' });

    if (results.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    const user = results[0];
    const isMatch = password === user.password; // ⚠️ Plain text password check (dev only)

    if (isMatch) {
      return res.status(200).json({
        message: 'Login successful',
        user: {
          id: user.id,
          login_id: user.login_id,
          role: user.role
        }
      });
    } else {
      return res.status(401).json({ message: 'Invalid password' });
    }
  });
});

// Submit Site Visit Form
app.post('/api/site-visit', (req, res) => {
  const {
    user_id,
    date_of_visit,
    client_name,
    client_designation,
    contact_number,
    client_mail,
    site_name,
    site_type,
    location_address,
    description
  } = req.body;

  const sql = `
    INSERT INTO site_visits 
    (user_id, date_of_visit, client_name, client_designation, contact_number, client_mail, site_name, site_type, location_address, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      user_id,
      date_of_visit,
      client_name,
      client_designation,
      contact_number,
      client_mail,
      site_name,
      site_type,
      location_address,
      description
    ],
    (err, result) => {
      if (err) {
        console.error('❌ Database Insert Error:', err);
        return res.status(500).send({ message: 'Database error', error: err });
      }

      res.send({ message: 'Site visit recorded successfully' });
    }
  );
});

// Get all site visits by a specific user
app.get('/api/site-visits/:user_id', (req, res) => {
  const userId = req.params.user_id;

  const sql = 'SELECT * FROM site_visits WHERE user_id = ? ORDER BY id DESC';
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('❌ User Fetch Error:', err);
      return res.status(500).json({ message: 'Error fetching user records' });
    }

    res.json(results);
  });
});

// ✅ Admin route to get all site visits
app.get('/api/site-visits/all', (req, res) => {
  const sql = `
    SELECT sv.*, COALESCE(u.login_id, 'Unknown') AS login_id
    FROM site_visits sv
    LEFT JOIN users u ON sv.user_id = u.id
    ORDER BY sv.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Admin Fetch Error:', err);
      return res.status(500).json({ message: 'Error fetching all records' });
    }

    console.log('✅ Admin Dashboard Results:', results); // 👈 LOG ADDED HERE
    res.json(results);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
