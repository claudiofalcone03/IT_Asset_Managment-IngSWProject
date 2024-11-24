const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const assetRouter = require('./routes/asset')

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static('public'));

// Importa le route
const dipendentiRoutes = require('./routes/dipendenti');
const assetRoutes = require('./routes/asset');
const accessoriRoutes = require('./routes/accessori');
const sediRoutes = require('./routes/sedi');
const licenzeRoutes = require('./routes/licenze');

// Usa le route
app.use('/api/dipendenti', dipendentiRoutes);
app.use('/api/asset', assetRoutes);
app.use('/api/accessori', accessoriRoutes);
app.use('/api/sedi', sediRoutes);
app.use('/api/licenze', licenzeRoutes);

// Porta
const PORT = 3000;
app.listen(PORT, () => console.log(`Server in esecuzione su http://localhost:${PORT}`));