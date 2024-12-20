// routes/licenze.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Rotta per ottenere tutte le licenze
router.get('/', (req, res) => {
  db.query('SELECT * FROM licenze', (err, results) => {
    if (err) {
      res.status(500).send('Errore nel recupero dei dati');
    } else {
      res.json(results);
    }
  });
});

// Rotta per aggiungere una nuova licenza
router.post('/', (req, res) => {
  const { product_key, nome, data_acquisto, data_scadenza, id_dipartimento, prezzo } = req.body;

  const query = 'INSERT INTO licenze (product_key, nome, data_acquisto, data_scadenza, id_dipartimento, prezzo) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [product_key, nome, data_acquisto, data_scadenza, id_dipartimento, prezzo], (err, results) => {
    if (err) {
      res.status(500).send('Errore nell\'aggiunta della licenza');
    } else {
      res.status(201).send('Licenza aggiunta con successo');
    }
  });
});

// Rotta per eliminare una licenza
router.delete('/:product_key', (req, res) => {
  const { product_key } = req.params;

  const query = 'DELETE FROM licenze WHERE product_key = ?';
  db.query(query, [product_key], (err, results) => {
    if (err) {
      res.status(500).send('Errore nell\'eliminazione della licenza');
    } else {
      res.status(200).send('Licenza eliminata con successo');
    }
  });
});

module.exports = router;