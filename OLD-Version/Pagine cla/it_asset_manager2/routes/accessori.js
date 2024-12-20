// routes/accessori.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Rotta per ottenere tutti gli accessori
router.get('/', (req, res) => {
  db.query('SELECT * FROM accessori', (err, results) => {
    if (err) {
      res.status(500).send('Errore nel recupero dei dati');
    } else {
      res.json(results);
    }
  });
});

// Rotta per aggiungere un nuovo accessorio
router.post('/', (req, res) => {
  const { seriale, nome_prodotto, tipo, modello, immagine, id_dipendente, costo_acquisto } = req.body;

  const query = 'INSERT INTO accessori (seriale, nome_prodotto, tipo, modello, immagine, id_dipendente, costo_acquisto) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [seriale, nome_prodotto, tipo, modello, immagine, id_dipendente, costo_acquisto], (err, results) => {
    if (err) {
      res.status(500).send('Errore nell\'aggiunta del nuovo accessorio');
    } else {
      res.status(201).send('Accessorio aggiunto con successo');
    }
  });
});

// Rotta per eliminare un accessorio
router.delete('/:seriale', (req, res) => {
  const { seriale } = req.params;

  const query = 'DELETE FROM accessori WHERE seriale = ?';
  db.query(query, [seriale], (err, results) => {
    if (err) {
      res.status(500).send('Errore nell\'eliminazione dell\'accessorio');
    } else {
      res.status(200).send('Accessorio eliminato con successo');
    }
  });
});

module.exports = router;