const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const dayjs = require('dayjs');
const { createObjectCsvWriter } = require('csv-writer');
const archiver = require('archiver');
const fs = require('fs');


app.use(express.static(path.join(__dirname, 'politech')));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());


// Connessione al database
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'claudio',
  password: 'ciao2', 
  database: 'politech_db'
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



// SEDI
//
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


// Rotte per ottenere le quantità di elementi
//
// Rotta per ottenere il numero degli asset
app.get('/api/assets/count', (req, res) => {
  // Esegui una query per ottenere il numero di asset
  const sql = 'SELECT COUNT(*) AS asset_count FROM assets';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Errore nella query: ', err);
      return res.status(500).json({ error: 'Errore nella query del database' });
    }
    // Restituisci il numero degli asset come risposta JSON
    res.json(results[0]);
  });
});

// Rotta per ottenere il numero dei dipendenti
app.get('/api/dipendenti/count', (req, res) => {
  // Esegui una query per ottenere il numero di dipendenti
  const sql = 'SELECT COUNT(*) AS dipendenti_count FROM dipendenti';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Errore nella query: ', err);
      return res.status(500).json({ error: 'Errore nella query del database' });
    }
    // Restituisci il numero 
    // Rotta per ottenere il numero dei dipendenti come risposta JSON
    res.json(results[0]);
  });
});

// Rotta per ottenere il numero degli  accessori
app.get('/api/accessori/count', (req, res) => {
  // Esegui una query per ottenere il numero di accessori
  const sql = 'SELECT COUNT(*) AS accessori_count FROM accessori';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Errore nella query: ', err);
      return res.status(500).json({ error: 'Errore nella query del database' });
    }
    // Restituisci il numero 
    // Rotta per ottenere il numero degli accessori come risposta JSON
    res.json(results[0]);
  });
});

// Rotta per ottenere il numero delle licenze
app.get('/api/lic/count', (req, res) => {
  // Esegui una query per ottenere il numero delle licenze
  const sql = 'SELECT COUNT(*) AS lic_count FROM licenze';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Errore nella query: ', err);
      return res.status(500).json({ error: 'Errore nella query del database' });
    }
    // Restituisci il numero 
    // Rotta per ottenere il numero delle licenze come risposta JSON
    res.json(results[0]);
  });
});
//


// Endpoint per ottenere le azioni recenti
app.get('/api/recent-actions', (req, res) => {
  const query = 'SELECT * FROM actions ORDER BY date DESC LIMIT 10'; // Preleva le ultime 10 azioni
  db.query(query, (err, results) => {
      if (err) {
          console.error('Errore nella query:', err);
          res.status(500).send('Errore nel recupero dei dati');
          return;
      }
      res.json(results); // Restituisce i risultati come JSON
  });
});


// Endpoint per ottenere lo stato degli asset
app.get('/api/asset-status', (req, res) => {
  const query = `
      SELECT status, COUNT(*) as count
      FROM assets
      GROUP BY status
  `;

  db.query(query, (err, results) => {
      if (err) {
          console.error('Errore durante il recupero dei dati:', err);
          return res.status(500).json({ error: 'Errore nel server' });
      }

      // Converti i dati in un formato compatibile con Chart.js
      const labels = [];
      const data = [];
      results.forEach(row => {
          labels.push(row.status); // 'Attivi', 'Inattivi', ecc.
          data.push(row.count);    // Quantità di asset per ogni stato
      });

      res.json({ labels, data });
  });
});

//ASSET
//

// Ottenere tutti gli asset con nome e cognome del dipendente e il nome della sede
app.get('/api/assets', (req, res) => {
  const sql = `
    SELECT 
      a.id AS id_asset, 
      a.name AS asset_name, 
      a.status, 
      a.data_inserimento, 
      a.data_acquisto, 
      a.costo, 
      CONCAT(d.nome_dip, ' ', d.cognome) AS dipendente,
      s.nome AS sede
    FROM assets a
    LEFT JOIN dipendenti d ON a.id_dipendenti_assets = d.id_dipPK
    LEFT JOIN sedi s ON d.id_sede_dip = s.id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Errore durante il recupero degli asset:', err);
      return res.status(500).send('Errore server');
    }
    res.json(results);
  });
});


// Ottenere un singolo asset con nome e cognome del dipendente e il nome della sede
app.get('/api/assets/:id', (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT 
      a.id AS id_asset, 
      a.name AS asset_name, 
      a.status, 
      a.data_inserimento, 
      a.data_acquisto, 
      a.costo, 
      CONCAT(d.nome_dip, ' ', d.cognome) AS dipendente,
      s.nome AS sede
    FROM assets a
    LEFT JOIN dipendenti d ON a.id_dipendenti_assets = d.id_dipPK
    LEFT JOIN sedi s ON d.id_sede_dip = s.id
    WHERE a.id = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Errore durante il recupero dell\'asset:', err);
      return res.status(500).send('Errore server');
    }

    if (results.length === 0) {
      return res.status(404).send('Asset non trovato');
    }

    res.json(results[0]); // Ritorna il primo risultato come oggetto singolo
  });
});


// Aggiungi nuovo asset
app.post('/api/assets', (req, res) => {
  const { name, status, data_inserimento, data_acquisto, costo, id_dipendenti_assets } = req.body;

  // SQL per inserire il nuovo asset senza il campo 'sede'
  const sql = `
    INSERT INTO assets (name, status, data_inserimento, data_acquisto, costo, id_dipendenti_assets)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  // Esegui la query
  db.query(sql, [name, status, data_inserimento, data_acquisto, costo, id_dipendenti_assets], (err, results) => {
    if (err) {
      console.error('Errore durante l\'aggiunta dell\'asset:', err);
      return res.status(500).send('Errore server');
    }
    res.status(201).send({ id: results.insertId, message: 'Asset aggiunto con successo' });
  });
});

// Modifica un asset
app.put('/api/assets/:id', (req, res) => {
  const { id } = req.params; // ID dell'asset da modificare
  const { name, status, data_inserimento, data_acquisto, costo, id_dipendenti_assets } = req.body;

  // Controlla se l'ID del dipendente è valido
  if (!id_dipendenti_assets) {
    return res.status(400).send('Il campo "id_dipendenti_assets" è obbligatorio.');
  }

  // Costruisci la query SQL per aggiornare l'asset
  const sql = `
    UPDATE assets
    SET name = ?, status = ?, data_inserimento = ?, data_acquisto = ?, costo = ?, id_dipendenti_assets = ?
    WHERE id = ?
  `;

  // Esegui la query
  db.query(sql, [name, status, data_inserimento, data_acquisto, costo, id_dipendenti_assets, id], (err, results) => {
    if (err) {
      console.error('Errore durante la modifica dell\'asset:', err);
      return res.status(500).send('Errore server');
    }

    // Se l'asset non è stato trovato, restituisci un errore
    if (results.affectedRows === 0) {
      return res.status(404).send('Asset non trovato');
    }

    // Se la modifica è avvenuta correttamente
    res.send({ message: 'Asset aggiornato con successo' });
  });
});

// Rimuovi un asset
app.delete('/api/assets/:id', (req, res) => {
  const { id } = req.params; // ID dell'asset da eliminare

  // SQL per eliminare l'asset
  const sql = 'DELETE FROM assets WHERE id = ?';

  // Esegui la query
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Errore durante l\'eliminazione dell\'asset:', err);
      return res.status(500).send('Errore server');
    }
    res.send({ message: 'Asset eliminato con successo' });
  });
});


// Rotta per ottenere il numero di asset per sede
app.get('/api/assets/count-by-sede', (req, res) => {
  const sql = `
    SELECT sede, COUNT(*) AS asset_count
    FROM assets
    GROUP BY sede
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Errore nella query:', err);
      return res.status(500).json({ error: 'Errore nella query del database' });
    }
    res.json(results); // Restituisce il numero di asset per sede
  });
});


// Endpoint per ottenere i dati per il grafico
app.get('/costi', (req, res) => {
  const sql = `
    SELECT 
      YEAR(data_acquisto) AS anno, 
      MONTH(data_acquisto) AS mese, 
      SUM(costo) AS totale_costo
    FROM assets
    GROUP BY YEAR(data_acquisto), MONTH(data_acquisto)
    ORDER BY anno, mese
  `;

  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send('Errore durante l\'esecuzione della query');
    } else {
      res.json(results);  // Risponde con i dati in formato JSON
    }
  });
});


// Rotta per ottenere il numero di dipendenti per sede
app.get('/api/dipendenti/count-by-sede', (req, res) => {
  const sql = `
    SELECT id_sede_dip, COUNT(*) AS dipendenti_count
    FROM dipendenti
    GROUP BY id_sede_dip
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Errore nella query:', err);
      return res.status(500).json({ error: 'Errore nella query del database' });
    }
    res.json(results); // Restituisce il numero di dipendenti per sede
  });
});



//DIPENDENTI
// Aggiungi dipendente
app.post('/api/dipendenti', (req, res) => {
  const { nome_dip, cognome, email, grado, id_sede_dip, id_dipart_dip } = req.body;

  const sql = `
    INSERT INTO dipendenti (nome_dip, cognome, email, grado, id_sede_dip, id_dipart_dip)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [nome_dip, cognome, email, grado, id_sede_dip, id_dipart_dip], (err, results) => {
    if (err) {
      console.error("Errore durante l'aggiunta del dipendente:", err);
      return res.status(500).send("Errore server");
    }
    res.status(201).send({ id: results.insertId, message: "Dipendente aggiunto con successo" });
  });
});

// Modifica dipendente
app.put('/api/dipendenti/:id', (req, res) => {
  const { id } = req.params;
  const { nome_dip, cognome, email, grado, id_sede_dip, id_dipart_dip } = req.body;

  const sql = `
    UPDATE dipendenti
    SET nome_dip = ?, cognome = ?, email = ?, grado = ?, id_sede_dip = ?, id_dipart_dip = ?
    WHERE id_dipPK = ?
  `;

  db.query(sql, [nome_dip, cognome, email, grado, id_sede_dip, id_dipart_dip, id], (err, results) => {
    if (err) {
      console.error("Errore durante la modifica del dipendente:", err);
      return res.status(500).send("Errore server");
    }
    res.send({ message: "Dipendente aggiornato con successo" });
  });
});

// Rimuovi dipendente
app.delete('/api/dipendenti/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM dipendenti WHERE id_dipPK = ?';

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Errore durante l'eliminazione del dipendente:", err);
      return res.status(500).send("Errore server");
    }
    res.send({ message: "Dipendente eliminato con successo" });
  });
});

// Ottieni un dipendente con sede e dipartimento
app.get('/api/dipendenti/:id', (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT 
      dipendenti.id_dipPK,
      dipendenti.nome_dip,
      dipendenti.cognome,
      dipendenti.email,
      dipendenti.grado,
      sedi.nome AS sede_nome,
      sedi.localita AS sede_localita,
      sedi.numero_persone AS sede_numero_persone,
      sedi.posti_disponibili AS sede_posti_disponibili,
      dipartimento.nome_dipartimento
    FROM dipendenti
    LEFT JOIN sedi ON dipendenti.id_sede_dip = sedi.id
    LEFT JOIN dipartimento ON dipendenti.id_dipart_dip = dipartimento.id_dipartimento
    WHERE dipendenti.id_dipPK = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Errore durante il recupero dei dati:', err.message);
      res.status(500).send('Errore server');
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Dipendente non trovato' });
      return;
    }

    // Aggiungere i dati relativi alla sede e al dipartimento
    const dipendenteConSedeEDipartimento = {
      ...results[0],
      sede: {
        nome: results[0].sede_nome || 'Non assegnata',
        localita: results[0].sede_localita || 'Non disponibile',
        numero_persone: results[0].sede_numero_persone || 'N/A',
        posti_disponibili: results[0].sede_posti_disponibili || 'N/A'
      },
      dipartimento: results[0].nome_dipartimento || 'Non assegnato'
    };

    res.json(dipendenteConSedeEDipartimento);
  });
});

// Recupera tutti i dipendenti con i dati collegati di sede e dipartimento
app.get('/api/dipendenti', (req, res) => {
  const { search, grado, sede, dipartimento } = req.query;

  let sql = `
    SELECT 
      dipendenti.id_dipPK,
      dipendenti.nome_dip,
      dipendenti.cognome,
      dipendenti.email,
      dipendenti.grado,
      sedi.nome AS sede_nome,
      sedi.localita AS sede_localita,
      sedi.numero_persone AS sede_numero_persone,
      sedi.posti_disponibili AS sede_posti_disponibili,
      dipartimento.nome_dipartimento
    FROM dipendenti
    LEFT JOIN sedi ON dipendenti.id_sede_dip = sedi.id
    LEFT JOIN dipartimento ON dipendenti.id_dipart_dip = dipartimento.id_dipartimento
    WHERE 1=1
  `;

  const params = [];

  // Aggiungi filtri se presenti
  if (search) {
    sql += ' AND (dipendenti.nome_dip LIKE ? OR dipendenti.cognome LIKE ? OR dipendenti.email LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (grado) {
    sql += ' AND dipendenti.grado LIKE ?';
    params.push(`%${grado}%`);
  }
  if (sede) {
    sql += ' AND sedi.nome LIKE ?';
    params.push(`%${sede}%`);
  }
  if (dipartimento) {
    sql += ' AND dipartimento.nome_dipartimento LIKE ?';
    params.push(`%${dipartimento}%`);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Errore durante il recupero dei dipendenti:", err.message);
      return res.status(500).send("Errore server");
    }

    // Prepara la risposta
    const dipendentiConSedeEDipartimento = results.map(dipendente => ({
      ...dipendente,
      sede: {
        nome: dipendente.sede_nome || 'Non assegnata',
        localita: dipendente.sede_localita || 'Non disponibile',
        numero_persone: dipendente.sede_numero_persone || 'N/A',
        posti_disponibili: dipendente.sede_posti_disponibili || 'N/A'
      },
      dipartimento: dipendente.nome_dipartimento || 'Non assegnato'
    }));

    res.json(dipendentiConSedeEDipartimento);
  });
});



// SEDI
//
//Aggiunta sedi
app.post('/api/sedi', (req, res) => {
  const { nome, localita, numero_persone, posti_disponibili } = req.body;

  const sql = `
    INSERT INTO sedi (nome, localita, numero_persone, posti_disponibili)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [nome, localita, numero_persone, posti_disponibili], (err, results) => {
    if (err) {
      console.error('Errore durante l\'aggiunta della sede:', err);
      return res.status(500).send('Errore server');
    }
    res.status(201).send({ id: results.insertId, message: 'Sede aggiunta con successo' });
  });
});

// Modifica sedi 
app.put('/api/sedi/:id', (req, res) => {
  const { id } = req.params;
  const { nome, localita, numero_persone, posti_disponibili } = req.body;

  const sql = `
    UPDATE sedi
    SET nome = ?, localita = ?, numero_persone = ?, posti_disponibili = ?
    WHERE id = ?
  `;

  db.query(sql, [nome, localita, numero_persone, posti_disponibili, id], (err, results) => {
    if (err) {
      console.error('Errore durante la modifica della sede:', err);
      return res.status(500).send('Errore server');
    }
    res.send({ message: 'Sede aggiornata con successo' });
  });
});

// Rimuovi sedi 
app.delete('/api/sedi/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM sedi WHERE id = ?';

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Errore durante l\'eliminazione della sede:', err);
      return res.status(500).send('Errore server');
    }

    if (results.affectedRows === 0) {
      // Nessuna riga eliminata
      return res.status(404).send({ message: 'Sede non trovata' });
    }

    res.send({ message: 'Sede eliminata con successo' });
  });
});

// Visualizza tutte le sedi
app.get('/api/sedi', (req, res) => {
  const {
    nome, 
    localita, 
    posti_disponibili_min, 
    posti_disponibili_max, 
    numero_persone_min, 
    numero_persone_max, 
    nameSort 
  } = req.query;

  let sql = 'SELECT * FROM sedi WHERE 1=1';
  const params = [];

  if (nome) {
    sql += ' AND nome LIKE ?';
    params.push(`%${nome}%`);
  }
  if (localita) {
    sql += ' AND localita LIKE ?';
    params.push(`%${localita}%`);
  }
  if (posti_disponibili_min) {
    sql += ' AND posti_disponibili >= ?';
    params.push(parseInt(posti_disponibili_min, 10));
  }
  if (posti_disponibili_max) {
    sql += ' AND posti_disponibili <= ?';
    params.push(parseInt(posti_disponibili_max, 10));
  }
  if (numero_persone_min) {
    sql += ' AND numero_persone >= ?';
    params.push(parseInt(numero_persone_min, 10));
  }
  if (numero_persone_max) {
    sql += ' AND numero_persone <= ?';
    params.push(parseInt(numero_persone_max, 10));
  }
  if (nameSort) {
    if (nameSort === 'asc') {
      sql += ' ORDER BY nome ASC';
    } else if (nameSort === 'desc') {
      sql += ' ORDER BY nome DESC';
    }
  }

  console.log('SQL Query:', sql);
  console.log('Parameters:', params);

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Errore durante il recupero dei dati:', err.message);
      res.status(500).send('Errore server');
      return;
    }
    res.json(results);
  });
});




//LICENZE
// Aggiungi una nuova licenza
app.post('/api/licenze', (req, res) => {
  const { nome_lic, prezzo_lic, id_dipart_lic, productkey, data_acquisto_lic, data_scadenza_lic } = req.body;

  const sql = `
    INSERT INTO licenze (nome_lic, prezzo_lic, id_dipart_lic, productkey, data_acquisto_lic, data_scadenza_lic)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [nome_lic, prezzo_lic, id_dipart_lic, productkey, data_acquisto_lic, data_scadenza_lic], (err, results) => {
    if (err) {
      console.error('Errore durante l\'aggiunta della licenza:', err);
      return res.status(500).send('Errore server');
    }
    res.status(201).send({ id: results.insertId, message: 'Licenza aggiunta con successo' });
  });
});

// Modifica una licenza esistente
app.put('/api/licenze/:id', (req, res) => {
  const { id } = req.params;
  const { nome_lic, prezzo_lic, productkey, data_acquisto_lic, data_scadenza_lic, id_dipart_lic } = req.body;

  const sql = `
    UPDATE licenze
    SET nome_lic = ?, prezzo_lic = ?, productkey = ?, data_acquisto_lic = ?, data_scadenza_lic = ?, id_dipart_lic = ?
    WHERE id_lic = ?
  `;

  db.query(sql, [nome_lic, prezzo_lic, productkey, data_acquisto_lic, data_scadenza_lic, id_dipart_lic, id], (err, results) => {
    if (err) {
      console.error('Errore durante la modifica della licenza:', err);
      return res.status(500).send('Errore durante la modifica della licenza');
    }

    if (results.affectedRows === 0) {
      return res.status(404).send({ message: 'Licenza non trovata' });
    }

    res.send({ message: 'Licenza aggiornata con successo' });
  });
});

//Ottieni una licenza
app.get('/api/licenze/:id', (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT licenze.*, dipartimento.nome_dipartimento 
    FROM licenze 
    LEFT JOIN dipartimento ON licenze.id_dipart_lic = dipartimento.id_dipartimento
    WHERE licenze.id_lic = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Errore durante il recupero dei dati:', err.message);
      res.status(500).send('Errore server');
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Licenza non trovata' });
      return;
    }

    // Aggiungere il nome del dipartimento se disponibile
    const licenzaConDipartimento = {
      ...results[0],
      dipartimento: results[0].nome_dipartimento || 'Dipartimento non disponibile',
    };

    res.json(licenzaConDipartimento);
  });
});

// Elimina una licenza
app.delete('/api/licenze/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM licenze WHERE id_lic = ?';

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Errore durante l\'eliminazione della licenza:', err);
      return res.status(500).send('Errore server');
    }

    if (results.affectedRows === 0) {
      return res.status(404).send({ message: 'Licenza non trovata' });
    }

    res.send({ message: 'Licenza eliminata con successo' });
  });
});

// Visualizza tutte le licenze con nome del dipartimento
app.get('/api/licenze', (req, res) => {
  const {
    nome_lic, 
    id_dipart_lic, 
    prezzo_lic_min, 
    prezzo_lic_max, 
    data_acquisto_min, 
    data_acquisto_max, 
    nameSort
  } = req.query;

  let sql = `
    SELECT licenze.*, dipartimento.nome_dipartimento 
    FROM licenze 
    LEFT JOIN dipartimento ON licenze.id_dipart_lic = dipartimento.id_dipartimento
    WHERE 1=1
  `;
  const params = [];

  if (nome_lic) {
    sql += ' AND licenze.nome_lic LIKE ?';
    params.push(`%${nome_lic}%`);
  }
  if (id_dipart_lic) {
    sql += ' AND licenze.id_dipart_lic = ?';
    params.push(id_dipart_lic);
  }
  if (prezzo_lic_min) {
    sql += ' AND licenze.prezzo_lic >= ?';
    params.push(parseFloat(prezzo_lic_min));
  }
  if (prezzo_lic_max) {
    sql += ' AND licenze.prezzo_lic <= ?';
    params.push(parseFloat(prezzo_lic_max));
  }
  if (data_acquisto_min) {
    sql += ' AND licenze.data_acquisto_lic >= ?';
    params.push(data_acquisto_min);
  }
  if (data_acquisto_max) {
    sql += ' AND licenze.data_acquisto_lic <= ?';
    params.push(data_acquisto_max);
  }
  if (nameSort) {
    if (nameSort === 'asc') {
      sql += ' ORDER BY licenze.nome_lic ASC';
    } else if (nameSort === 'desc') {
      sql += ' ORDER BY licenze.nome_lic DESC';
    }
  }

  console.log('SQL Query:', sql);
  console.log('Parameters:', params);

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Errore durante il recupero dei dati:', err.message);
      res.status(500).send('Errore server');
      return;
    }

    // Controllo e visualizzazione dei risultati
    const licenzeConDipartimento = results.map(licenza => ({
      ...licenza,
      dipartimento: licenza.nome_dipartimento || 'Dipartimento non disponibile'
    }));

    res.json(licenzeConDipartimento);
  });
});



//DIPARTIMENTI
// Ottieni tutti i dipartimenti
app.get('/api/dipartimento', (req, res) => {
  const sql = `
    SELECT id_dipartimento, nome_dipartimento
    FROM dipartimento
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Errore durante il recupero dei dipartimenti:', err);
      return res.status(500).send('Errore server');
    }
    res.json(results);
  });
});

// Aggiungi un nuovo dipartimento
app.post('/api/dipartimento', (req, res) => {
  const { nome_dipartimento } = req.body;

  const sql = `
    INSERT INTO dipartimento (nome_dipartimento)
    VALUES (?)
  `;

  db.query(sql, [nome_dipartimento], (err, results) => {
    if (err) {
      console.error('Errore durante l\'aggiunta del dipartimento:', err);
      return res.status(500).send('Errore server');
    }
    res.status(201).send({ id: results.insertId, message: 'Dipartimento aggiunto con successo' });
  });
});

// Modifica un dipartimento esistente
app.put('/api/dipartimento/:id', (req, res) => {
  const { id } = req.params;
  const { nome_dipartimento } = req.body;

  const sql = `
    UPDATE dipartimento
    SET nome_dipartimento = ?
    WHERE id_dipartimento = ?
  `;

  db.query(sql, [nome_dipartimento, id], (err, results) => {
    if (err) {
      console.error('Errore durante la modifica del dipartimento:', err);
      return res.status(500).send('Errore server');
    }

    if (results.affectedRows === 0) {
      return res.status(404).send({ message: 'Dipartimento non trovato' });
    }

    res.send({ message: 'Dipartimento aggiornato con successo' });
  });
});

// Elimina un dipartimento
app.delete('/api/dipartimento/:id', (req, res) => {
  const { id } = req.params;

  const sql = `
    DELETE FROM dipartimento
    WHERE id_dipartimento = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Errore durante l\'eliminazione del dipartimento:', err);
      return res.status(500).send('Errore server');
    }

    if (results.affectedRows === 0) {
      return res.status(404).send({ message: 'Dipartimento non trovato' });
    }

    res.send({ message: 'Dipartimento eliminato con successo' });
  });
});



//ACCESSORI
// Ottieni tutti gli accessori
app.get('/api/accessori', (req, res) => {
  const sql = 'SELECT * FROM accessori';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Errore durante il recupero degli accessori:', err);
      return res.status(500).send('Errore server');
    }
    res.json(results);
  });
});

// Aggiungi un nuovo accessorio
app.post('/api/accessori', (req, res) => {
  const { nome_accessori, seriale_accessori, categoria_accessori, modello_accessori, costo_accessori } = req.body;

  const sql = `
    INSERT INTO accessori (nome_accessori, seriale_accessori, categoria_accessori, modello_accessori, costo_accessori)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [nome_accessori, seriale_accessori, categoria_accessori, modello_accessori, costo_accessori], (err, results) => {
    if (err) {
      console.error('Errore durante l\'aggiunta dell\'accessorio:', err);
      return res.status(500).send('Errore server');
    }
    res.status(201).send({ id: results.insertId, message: 'Accessorio aggiunto con successo' });
  });
});

// Modifica un accessorio esistente
app.put('/api/accessori/:id', (req, res) => {
  const { id } = req.params;
  const { nome_accessori, seriale_accessori, categoria_accessori, modello_accessori, costo_accessori } = req.body;

  const sql = `
    UPDATE accessori
    SET nome_accessori = ?, seriale_accessori = ?, categoria_accessori = ?, modello_accessori = ?, costo_accessori = ?
    WHERE id_accessori = ?
  `;

  db.query(sql, [nome_accessori, seriale_accessori, categoria_accessori, modello_accessori, costo_accessori, id], (err, results) => {
    if (err) {
      console.error('Errore durante la modifica dell\'accessorio:', err);
      return res.status(500).send('Errore server');
    }

    if (results.affectedRows === 0) {
      return res.status(404).send({ message: 'Accessorio non trovato' });
    }

    res.send({ message: 'Accessorio aggiornato con successo' });
  });
});

// Elimina un accessorio
app.delete('/api/accessori/:id', (req, res) => {
  const { id } = req.params;

  const sql = `
    DELETE FROM accessori
    WHERE id_accessori = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Errore durante l\'eliminazione dell\'accessorio:', err);
      return res.status(500).send('Errore server');
    }

    if (results.affectedRows === 0) {
      return res.status(404).send({ message: 'Accessorio non trovato' });
    }

    res.send({ message: 'Accessorio eliminato con successo' });
  });
});

// Endpoint per ottenere le categorie uniche dagli accessori
app.get('/api/accessori/categories', (req, res) => {
  const query = 'SELECT DISTINCT categoria_accessori FROM accessori';
  
  db.execute(query, (err, results) => {
      if (err) {
          console.error('Errore nel recupero delle categorie:', err);
          return res.status(500).json({ error: 'Errore nel recupero delle categorie' });
      }

      const categories = results.map(row => row.categoria_accessori);
      res.json(categories);
  });
});

//Endpoint aggiornato
// Endpoint per ottenere gli accessori con filtri
app.get('/api/accessori', (req, res) => {
  const { priceSort, categoria_accessori, search } = req.query;
  let query = 'SELECT * FROM accessori WHERE 1=1'; // Query base

  // Aggiungi filtri
  if (categoria_accessori) query += ` AND categoria_accessori = '${categoria_accessori}'`;
  if (search) query += ` AND (nome_accessori LIKE '%${search}%' OR seriale_accessori LIKE '%${search}%')`;

  // Aggiungi ordinamento per prezzo
  if (priceSort) {
      query += priceSort === 'asc' ? ' ORDER BY costo_accessori ASC' : ' ORDER BY costo_accessori DESC';
  }

  db.execute(query, (err, results) => {
      if (err) {
          console.error('Errore durante il recupero degli accessori:', err);
          return res.status(500).json({ error: 'Errore durante il recupero degli accessori' });
      }
      res.json(results);
  });
});
// Rotta per ottenere i dati del numero di dipendenti per sede
app.get('/api/dipendenti-per-sede', (req, res) => {
  const query = `
    SELECT s.nome, COUNT(d.id_dipPK) AS numero_dipendenti
    FROM sedi s
    LEFT JOIN dipendenti d ON s.id = d.id_sede_dip
    GROUP BY s.id;
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});



// Funzione per ottenere i dati
const getAccessoriesByCategory = (req, res) => {
  const query = `
      SELECT categoria_accessori, COUNT(*) AS numero_accessori
      FROM accessori
      GROUP BY categoria_accessori;
  `;
  db.query(query, (err, results) => {
      if (err) {
          console.error('Errore durante il recupero dei dati:', err);
          res.status(500).send('Errore interno del server');
          return;
      }
      res.json(results); // Invia i dati come JSON al frontend
  });
};

module.exports = { getAccessoriesByCategory };
app.get('/api/accessori/categorie', getAccessoriesByCategory);


// Endpoint per ottenere licenze in scadenza nei prossimi 30 giorni
app.get('/api/licenze-in-scadenza', (req, res) => {
  // Calcola le date
  const oggi = dayjs().format('YYYY-MM-DD'); // Data odierna
  const dataLimite = dayjs().add(30, 'day').format('YYYY-MM-DD'); // Data limite (30 giorni da oggi)

  // Log per il debug
  console.log('Date calcolate:', { oggi, dataLimite });

  // Query SQL con parametri
  const query = `
    SELECT 
      l.id_lic, 
      l.nome_lic, 
      l.prezzo_lic, 
      l.productkey, 
      l.data_acquisto_lic, 
      l.data_scadenza_lic, 
      d.nome_dipartimento
    FROM licenze l
    LEFT JOIN dipartimento d ON l.id_dipart_lic = d.id_dipartimento
    WHERE l.data_scadenza_lic BETWEEN ? AND ?
  `;

  // Esegui la query
  db.query(query, [oggi, dataLimite], (err, results) => {
    if (err) {
      console.error('Errore durante il recupero delle licenze in scadenza:', err);
      return res.status(500).json({ error: 'Errore durante il recupero delle licenze' });
    }

    // Log per il debug dei risultati
    console.log('Risultati della query:', results);

    // Gestione del caso in cui non ci siano licenze in scadenza
    if (results.length === 0) {
      return res.status(404).json({ message: 'Nessuna licenza in scadenza trovata' });
    }

    // Rispondi con i risultati
    res.json(results);
  });
});

//Funzione per esportare in CSV
app.get('/api/export-all', (req, res) => {
  // Recupera l'elenco delle tabelle nel database
  db.query('SHOW TABLES', (err, tables) => {
      if (err) {
          console.error('Errore durante l\'estrazione delle tabelle:', err);
          return res.status(500).send('Errore durante l\'estrazione delle tabelle.');
      }

      // Crea un archivio ZIP
      const zipFilePath = path.join(__dirname, 'database_backup.zip');
      const archive = archiver('zip', {
          zlib: { level: 9 } // Livello di compressione massimo
      });

      // Crea un flusso di scrittura per il file ZIP
      const output = fs.createWriteStream(zipFilePath);
      archive.pipe(output);

      // Esporta ogni tabella in un file CSV separato
      let tablesProcessed = 0;
      tables.forEach((table) => {
          const tableName = table[`Tables_in_${db.config.database}`];
          const sql = `SELECT * FROM \`${tableName}\``;

          db.query(sql, (err, results) => {
              if (err) {
                  console.error(`Errore durante il recupero dei dati per la tabella ${tableName}:`, err);
              } else {
                  const csvWriter = createObjectCsvWriter({
                      path: `${tableName}.csv`,  // Nome del file CSV per questa tabella
                      header: Object.keys(results[0] || {}).map(column => ({ id: column, title: column }))
                  });

                  csvWriter.writeRecords(results)
                      .then(() => {
                          console.log(`Tabella ${tableName} esportata con successo`);

                          // Aggiungi il file CSV all'archivio ZIP
                          archive.append(fs.createReadStream(`${tableName}.csv`), { name: `${tableName}.csv` });

                          // Rimuovi il file temporaneo CSV
                          fs.unlinkSync(`${tableName}.csv`);

                          tablesProcessed++;
                          if (tablesProcessed === tables.length) {
                              archive.finalize();
                          }
                      })
                      .catch((error) => {
                          console.error(`Errore durante la scrittura del CSV per la tabella ${tableName}:`, error);
                      });
              }
          });
      });

      // Quando l'archivio ZIP è pronto, invia una risposta al client
      output.on('close', () => {
          console.log(`Archivio ZIP creato: ${zipFilePath}`);
          res.download(zipFilePath, 'database_backup.zip', (err) => {
              if (err) {
                  console.error('Errore durante il download del file ZIP:', err);
              } else {
                  // Dopo il download, elimina il file ZIP dal server
                  fs.unlinkSync(zipFilePath);
              }
          });
      });
  });
});



// Avvia il server sulla porta 3000
app.listen(3000, () => {
  console.log('Server in ascolto sulla porta 3000');
});


