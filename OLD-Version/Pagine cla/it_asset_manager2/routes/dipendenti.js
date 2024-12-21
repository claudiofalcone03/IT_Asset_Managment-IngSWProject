const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Recupera tutti i dipendenti
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM dipendenti');
    res.json(rows);
  } catch (err) {
    console.error('Errore nel recuperare i dati:', err);
    res.status(500).send('Errore nel recuperare i dati');
  }
});

// Aggiungi un nuovo dipendente
router.post('/', async (req, res) => {
  const { nome, cognome, ruolo } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO dipendenti (nome, cognome, ruolo) VALUES (?, ?, ?)',
      [nome, cognome, ruolo]
    );
    res.status(201).json({ id: result.insertId, nome, cognome, ruolo });
  } catch (err) {
    console.error('Errore nell\'aggiungere i dati:', err);
    res.status(500).send('Errore nell\'aggiungere i dati');
  }
});

// Elimina un dipendente
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM dipendenti WHERE id = ?', [id]);
    res.status(204).send(); // Nessun contenuto
  } catch (err) {
    console.error('Errore nel rimuovere i dati:', err);
    res.status(500).send('Errore nel rimuovere i dati');
  }
});

module.exports = router;