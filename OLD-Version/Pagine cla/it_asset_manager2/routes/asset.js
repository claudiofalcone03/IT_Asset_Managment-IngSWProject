const express = require('express');
const multer = require('multer');
const fs = require('fs');
const pool = require('../config/db');

const router = express.Router();

// Configurazione multer per caricare file (in questo caso immagini)
// In questo caso multer non è necessario se non carichi l'immagine
// Non vogliamo nemmeno usare `upload.single('immagine')`
router.post('/', async (req, res) => {
  const {
    seriale,
    nome_asset,
    modello,
    categoria,
    status,
    costo_acquisto,
    valore_corrente,
    dipendente_ID
  } = req.body;
  const immagine = null;  // Nessuna immagine fornita, mettiamo NULL

  try {
    const [result] = await pool.query(
      'INSERT INTO asset (seriale, nome_asset, immagine, modello, categoria, status, costo_acquisto, valore_corrente, dipendente_ID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [seriale, nome_asset, immagine, modello, categoria, status, costo_acquisto, valore_corrente, dipendente_ID]
    );
    res.status(201).json({
      id: result.insertId,
      seriale,
      nome_asset,
      immagine: immagine ? 'Immagine caricata' : null,  // Indica che l'immagine è NULL
      modello,
      categoria,
      status,
      costo_acquisto,
      valore_corrente,
      dipendente_ID
    });
  } catch (err) {
    console.error('Errore nell\'aggiungere l\'asset:', err);
    res.status(500).send('Errore nel server');
  }
});

module.exports = router;