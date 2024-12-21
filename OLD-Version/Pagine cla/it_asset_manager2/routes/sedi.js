// routes/sedi.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Rotta per ottenere tutte le sedi
router.get('/', (req, res) => {
  db.query('SELECT * FROM sedi', (err, results) => {
    if (err) {
      res.status(500).send('Errore nel recupero dei dati');
    } else {
      res.json(results);
    }
  });
});

// Rotta per aggiungere una nuova sede
router.post('/', (req, res) => {
  const { nome_sede, località, post_totali, post_occupati, post_rimanenti } = req.body;

  const query = 'INSERT INTO sedi (nome_sede, località, post_totali, post_occupati, post_rimanenti) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [nome_sede, località, post_totali, post_occupati, post_rimanenti], (err, results) => {
    if (err) {
      res.status(500).send('Errore nell\'aggiunta della sede');
    } else {
      res.status(201).send('Sede aggiunta con successo');
    }
  });
});

// Rotta per eliminare una sede
router.delete('/:id_sede', (req, res) => {
  const { id_sede } = req.params;

  const query = 'DELETE FROM sedi WHERE id_sede = ?';
  db.query(query, [id_sede], (err, results) => {
    if (err) {
      res.status(500).send('Errore nell\'eliminazione della sede');
    } else {
      res.status(200).send('Sede eliminata con successo');
    }
  });
});

module.exports = router;