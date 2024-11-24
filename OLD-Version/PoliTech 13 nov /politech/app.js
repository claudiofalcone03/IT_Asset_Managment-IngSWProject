const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connessione al database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mikaela1', 
  database: 'login_db'
});

db.connect((err) => {
  if (err) {
    console.error('Errore di connessione al database:', err.stack);
    return;
  }
  console.log('Connesso al database MySQL');
});

// Funzione di autenticazione del token - assicurati che questa sia definita qui
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token non fornito' });
  }

  jwt.verify(token, 'segreto', (err, user) => {
    if (err) return res.status(403).json({ error: 'Token non valido' });
    req.user = user;
    next();
  });
}

// Rotta di login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username e password sono obbligatori' });
  }

  const query = 'SELECT * FROM users WHERE username = ?';
  db.execute(query, [username], (err, results) => {
    if (err) {
      console.error('Errore durante la query:', err);
      return res.status(500).json({ error: 'Errore interno del server' });
    }

    if (results.length === 0) {
      return res.status(400).json({ error: 'Username non trovato' });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Errore durante il confronto della password:', err);
        return res.status(500).json({ error: 'Errore interno del server' });
      }

      if (isMatch) {
        const token = jwt.sign({ id: user.id, username: user.username }, 'segreto', { expiresIn: '1h' });
        return res.json({ token });
      } else {
        return res.status(400).json({ error: 'Password errata' });
      }
    });
  });
});

// Endpoint per visualizzare tutte le sedi (protetto)
app.get('/sedi', authenticateToken, (req, res) => {
  db.query('SELECT * FROM sedi', (err, results) => {
    if (err) return res.status(500).json({ error: 'Errore nel caricamento delle sedi' });
    res.json(results);
  });
});
// Endpoint per ottenere una sede specifica (protetto)
app.get('/sedi/:id', authenticateToken, (req, res) => {
    const { id } = req.params; // Ottieni l'ID dalla route
  
    db.query('SELECT * FROM sedi WHERE id = ?', [id], (err, results) => {
      if (err) return res.status(500).json({ error: 'Errore nel recupero dei dati della sede' });
  
      if (results.length === 0) {
        return res.status(404).json({ error: 'Sede non trovata' }); // Se la sede non esiste
      }
  
      res.json(results[0]); // Restituisce solo il primo risultato, poiché l'ID è unico
    });
  });
// Endpoint per aggiungere una nuova sede (protetto)
app.post('/sedi', authenticateToken, (req, res) => {
  const { nome, localita, numero_persone, posti_disponibili } = req.body;
  db.query(
    'INSERT INTO sedi (nome, localita, numero_persone, posti_disponibili) VALUES (?, ?, ?, ?)',
    [nome, localita, numero_persone, posti_disponibili],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id: result.insertId, nome, localita, numero_persone, posti_disponibili });
    }
  );
});

// Endpoint per modificare una sede esistente (protetto)
app.put('/sedi/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { nome, localita, numero_persone, posti_disponibili } = req.body;
  db.query(
    'UPDATE sedi SET nome = ?, localita = ?, numero_persone = ?, posti_disponibili = ? WHERE id = ?',
    [nome, localita, numero_persone, posti_disponibili, id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id, nome, localita, numero_persone, posti_disponibili });
    }
  );
});

// Endpoint per rimuovere una sede (protetto)
app.delete('/sedi/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM sedi WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: `Sede con ID ${id} eliminata con successo.` });
  });
});

// Avvia il server sulla porta 3000
app.listen(3000, () => {
  console.log('Server in ascolto sulla porta 3000');
});
