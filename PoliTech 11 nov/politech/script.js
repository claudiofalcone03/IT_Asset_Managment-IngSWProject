document.getElementById('payment-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Previene l'invio del form

    // Recupera i valori dai campi
    const cardNumber = document.getElementById('card-number').value;
    const cardHolder = document.getElementById('card-holder').value;
    const expiryDate = document.getElementById('expiry-date').value;
    const cvv = document.getElementById('cvv').value;
    const errorMessage = document.getElementById('error-message');

    // Resetta lo stato degli input
    const inputFields = document.querySelectorAll('.input-field');
    inputFields.forEach(input => input.classList.remove('error'));
    errorMessage.textContent = '';

    // Validazione semplice
    let isValid = true;

    if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
        document.getElementById('card-number').classList.add('error');
        isValid = false;
    }
    if (cardHolder.trim() === '') {
        document.getElementById('card-holder').classList.add('error');
        isValid = false;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        document.getElementById('expiry-date').classList.add('error');
        isValid = false;
    }
    if (!/^\d{3}$/.test(cvv)) {
        document.getElementById('cvv').classList.add('error');
        isValid = false;
    }

    // Se è tutto valido, mostra un messaggio di successo, altrimenti mostra un errore
    if (isValid) {
        // Reindirizza a una pagina di successo
        window.location.href = 'success.html'; // Assicurati di avere questa pagina
    } else {
        errorMessage.textContent = 'Pagamento non autorizzato.';
    }
});
