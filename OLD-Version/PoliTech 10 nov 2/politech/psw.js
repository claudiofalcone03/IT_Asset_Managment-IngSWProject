// CODICE PER AVERE LE PSW CRIPTATE


const bcrypt = require('bcrypt');
const saltRounds = 10;
const password = 'prova'; // La password che vuoi criptare

bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
        console.log('Errore nella generazione del hash:', err);
    } else {
        console.log('Password criptata:', hashedPassword);
        // Ora puoi inserire la password criptata nel database
        // Esegui la query per inserire l'utente nel database
    }
});