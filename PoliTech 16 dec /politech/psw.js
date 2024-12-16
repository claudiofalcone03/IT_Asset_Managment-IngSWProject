// CODICE PER AVERE LE PSW CRIPTATE


const bcrypt = require('bcrypt');
const saltRounds = 10;
const password = 'ciao'; // La password che vuoi criptare

bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
        console.log('Errore nella generazione del hash:', err);
    } else {
        console.log('Password criptata:', hashedPassword);
    
    }
});