const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',        // Host del database
  user: 'root',       // Utente MySQL
  password: 'rocket##123', // Password MySQL
  database: 'it_asset_manager2', // Nome del database
  port: 3306,               // Porta predefinita MySQL
});

module.exports = pool.promise(); // Usa Promise per lavorare con async/await