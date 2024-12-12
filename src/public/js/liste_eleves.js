document.addEventListener('DOMContentLoaded', function () {
    const classFilter = document.getElementById('class-filter');
    const elevesList = document.getElementById('eleves-list');
    const professeurInfo = document.getElementById('prof-info');
    const professeurNom = document.getElementById('professeur-nom'); // Élément pour afficher le nom du professeur

    // Fonction de filtrage
    function filterEleves() {
        const selectedClass = classFilter.value;

        // Initialiser le nom du professeur
        let professeurAssocie = 'Aucun professeur sélectionné';

        // Récupérer toutes les lignes d'élèves
        const elevesRows = elevesList.getElementsByClassName('eleve-row');

        // Parcourir chaque ligne pour afficher ou masquer selon la classe sélectionnée
        for (let row of elevesRows) {
            const eleveClasse = row.getAttribute('data-classe');
            const eleveProf = row.getAttribute('data-prof');

            // Si 'Toutes les classes' est sélectionné, on affiche toutes les lignes
            if (selectedClass === 'all') {
                row.style.display = '';
                professeurInfo.style.display = 'none';
            } else {
                // Sinon, on filtre en fonction de la classe
                if (eleveClasse === selectedClass) {
                    row.style.display = '';

                    // Définir le professeur associé si la classe correspond
                    if (eleveProf && eleveProf !== 'Non assigné') {
                        professeurAssocie = eleveProf;
                    }
                } else {
                    row.style.display = 'none';
                }
                professeurInfo.style.display = "block";
            }
        }

        // Mettre à jour le texte du professeur
        professeurNom.textContent = professeurAssocie;
    }

    // Ajouter un événement sur le changement du filtre
    classFilter.addEventListener('change', filterEleves);
});
