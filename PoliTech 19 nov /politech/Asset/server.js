// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Database connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rocket##123',
  database: 'it_asset_manager1'
});

// Routes
app.get('/api/assets', (req, res) => {
  connection.query('SELECT * FROM Asset', (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

app.post('/api/assets', (req, res) => {
  const asset = req.body;
  connection.query('INSERT INTO Asset SET ?', asset, (error, results) => {
    if (error) throw error;
    res.json({ id: results.insertId, ...asset });
  });
});

app.put('/api/assets/:id', (req, res) => {
  const id = req.params.id;
  const asset = req.body;
  connection.query('UPDATE Asset SET ? WHERE id = ?', [asset, id], (error) => {
    if (error) throw error;
    res.json({ id, ...asset });
  });
});

app.delete('/api/assets/:id', (req, res) => {
  const id = req.params.id;
  connection.query('DELETE FROM Asset WHERE id = ?', id, (error) => {
    if (error) throw error;
    res.json({ id });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});