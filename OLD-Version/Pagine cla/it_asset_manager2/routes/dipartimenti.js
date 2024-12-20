// routes/dipartimenti.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Rotta per ottenere tutti i dipartimenti
router.get('/', (req, res) => {
  db.query('SELECT * FROM dipartimento', (err, results) => {
    if (err) {
      res.status(500).send('Errore nel recupero dei dati');
    } else {
      res.json(results);
    }
  });
});

// Rotta per aggiungere un nuovo dipartimento
router.post('/', (req, res) => {
  const { nome_dipartimento } = req.body;

  const query = 'INSERT INTO dipartimento (nome_dipartimento) VALUES (?)';
  db.query(query, [nome_dipartimento], (err, results) => {
    if (err) {
      res.status(500).send('Errore nell\'aggiunta del dipartimento');
    } else {
      res.status(201).send('Dipartimento aggiunto con successo');
    }
  });
});

// Rotta per eliminare un dipartimento
router.delete('/:id_dipartimento', (req, res) => {
  const { id_dipartimento } = req.params;

  const query = 'DELETE FROM dipartimento WHERE id_dipartimento = ?';
  db.query(query, [id_dipartimento], (err, results) => {
    if (err) {
      res.status(500).send('Errore nell\'eliminazione del dipartimento');
    } else {
      res.status(200).send('Dipartimento eliminato con successo');
    }
  });
});

module.exports = router;