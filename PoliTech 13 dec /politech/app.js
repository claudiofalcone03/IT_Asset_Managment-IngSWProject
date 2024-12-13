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
app.use(express.json());

// Connessione al database
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'claudio',
  password: 'ciao2', 
  database: 'database30nov'
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
  const sql = 'SELECT COUNT(*) AS lic_count FROM lic';

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

//Ottenere tutti gli assets
app.get('/api/assets', (req, res) => {
  const { status, sede } = req.query; // Ottieni i parametri dalla query string
  const { priceSort } = req.query; 

  // Crea una query di base
  let sql = 'SELECT * FROM assets WHERE 1=1';
  const params = [];

  // Aggiungi i filtri, se presenti
  if (status) {
    sql += ' AND status = ?';
    params.push(status);
  }
  if (sede) {
    sql += ' AND sede = ?';
    params.push(sede);

    
  }
  if (priceSort) {
    if (priceSort === 'asc') {
      sql += ' ORDER BY costo ASC';
    } else if (priceSort === 'desc') {
      sql += ' ORDER BY costo DESC';
    }
  }
  // Esegui la query con i filtri
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Errore durante il recupero dei dati:', err);
      res.status(500).send('Errore server');
      return;
    }
    res.json(results); // Rispondi con i dati filtrati
  });
});



//ASSET
//
// Aggiungi nuovo asset
app.post('/api/assets', (req, res) => {
  const { name, status, data_inserimento, sede, data_acquisto, costo } = req.body;

  const sql = `
    INSERT INTO assets (name, status, data_inserimento, sede, data_acquisto, costo)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [name, status, data_inserimento, sede, data_acquisto, costo], (err, results) => {
    if (err) {
      console.error('Errore durante l\'aggiunta dell\'asset:', err);
      return res.status(500).send('Errore server');
    }
    res.status(201).send({ id: results.insertId, message: 'Asset aggiunto con successo' });
  });
});

// Modifica un asset
app.put('/api/assets/:id', (req, res) => {
  const { id } = req.params;
  const { name, status, data_inserimento, sede, data_acquisto, costo } = req.body;

  const sql = `
    UPDATE assets
    SET name = ?, status = ?, data_inserimento = ?, sede = ?, data_acquisto = ?, costo = ?
    WHERE id = ?
  `;

  db.query(sql, [name, status, data_inserimento, sede, data_acquisto, costo, id], (err, results) => {
    if (err) {
      console.error('Errore durante la modifica dell\'asset:', err);
      return res.status(500).send('Errore server');
    }
    res.send({ message: 'Asset aggiornato con successo' });
  });
});

// Rimuovi un asset
app.delete('/api/assets/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM assets WHERE id = ?';

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
    WHERE id_accessori_dip = ?
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
    WHERE id_accessori_dip = ?
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

// Avvia il server sulla porta 3000
app.listen(3000, () => {
  console.log('Server in ascolto sulla porta 3000');
});


