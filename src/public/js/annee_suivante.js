document.getElementById('form-cloture').addEventListener('submit', function(event) {
    // Afficher une boîte de confirmation avant la soumission du formulaire
    var confirmation = confirm("Êtes-vous sûr de vouloir clôturer l'année et passer à l'année suivante ? Cette action est irreversible.");
    
    if (!confirmation) {
        event.preventDefault();
    }
});