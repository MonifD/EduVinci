document.addEventListener('DOMContentLoaded', function () {
    const redoubleOui = document.querySelector('input[name="redouble"][value="true"]');
    const redoubleNon = document.querySelector('input[name="redouble"][value="false"]');
    const redoubleYears = document.getElementById('redouble-years');

    // Fonction pour gérer l'affichage du champ en fonction de la sélection
    function toggleRedoubleYears() {
        if (redoubleOui.checked) {
            redoubleYears.style.display = 'block'; // Afficher le champ
        } else {
            redoubleYears.style.display = 'none'; // Cacher le champ
        }
    }

    // Initialiser l'affichage au chargement
    toggleRedoubleYears();

    // Ajouter des écouteurs d'événements pour changer la visibilité en fonction de la sélection
    redoubleOui.addEventListener('change', toggleRedoubleYears);
    redoubleNon.addEventListener('change', toggleRedoubleYears);
});