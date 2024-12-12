document.addEventListener('DOMContentLoaded', function () {
    const divManuelle = document.getElementById('manuelle');
    const divFichier = document.getElementById('fichier');
    const radioButtons = document.querySelectorAll('input[name="type-inscription"]');
    let selectedValue = document.querySelector('input[name="type-inscription"]:checked').value;

    radioButtons.forEach(button => {
        button.addEventListener('change', function() {
            selectedValue = document.querySelector('input[name="type-inscription"]:checked').value;
            if (selectedValue === "Manuelle") {
                divManuelle.style.display = 'block';
                divFichier.style.display = 'none';
            }
            else {
                divManuelle.style.display = 'none';
                divFichier.style.display = 'block';
            }
        });
    });

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