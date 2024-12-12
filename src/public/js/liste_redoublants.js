// Récupérer les données injectées dans le DOM
const eleves = JSON.parse(document.getElementById('eleves-data').textContent);

// Conteneurs pour les tableaux
const elevesTableContainer = document.getElementById('eleves-table');
const redoublesTableContainer = document.getElementById('redoubles-table');
const classFilter = document.getElementById('class-filter');

// Fonction pour générer un tableau HTML
function generateTable(data, isRedouble) {
    if (data.length === 0) {
        return isRedouble 
            ? '<p>Aucun élève n\'est enregistré en tant que redoublant.</p>'
            : '<p>Aucun élève n\'est inscrit pour le moment.</p>';
    }

    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Date de naissance</th>
                    <th>Classe</th>
                </tr>
            </thead>
            <tbody>
    `;

    data.forEach(eleve => {
        tableHTML += `
            <tr>
                <td><p>${eleve.nom}</p></td>
                <td><p>${eleve.prenom}</p></td>
                <td id="td-center"><p>${new Date(eleve.date_naissance).toISOString().split('T')[0]}</p></td>
                <td id="td-center"><p>${eleve.Classe ? eleve.Classe.libelle : 'Non assigné'}</p></td>
                <td class="plus-column" id="td-center">
                    <button class="toggle-redouble" data-id="${eleve.id}">${isRedouble ? '-' : '+'}</button>
                </td>
            </tr>
        `;
    });

    tableHTML += '</tbody></table>';
    return tableHTML;
}

// Fonction pour filtrer les élèves par classe
function filterByClass(data, selectedClass) {
    if (selectedClass === 'all') {
        return data;
    }
    return data.filter(eleve => eleve.Classe && eleve.Classe.libelle === selectedClass);
}

// Séparer les élèves en fonction de "redouble"
let nonRedoublants = eleves.filter(eleve => eleve.redouble === false);
let redoublants = eleves.filter(eleve => eleve.redouble === true);

// Fonction pour afficher les tableaux
function renderTables(selectedClass = 'all') {
    const filteredNonRedoublants = filterByClass(nonRedoublants, selectedClass);
    const filteredRedoublants = filterByClass(redoublants, selectedClass);

    elevesTableContainer.innerHTML = generateTable(filteredNonRedoublants, false);
    redoublesTableContainer.innerHTML = generateTable(filteredRedoublants, true);
}

renderTables(); // Affichage initial

// Ajouter un gestionnaire d'événement pour la liste déroulante
classFilter.addEventListener('change', (event) => {
    const selectedClass = event.target.value;
    renderTables(selectedClass);
});

// Fonction pour envoyer une requête PUT
async function toggleRedoublement(id) {
    try {
        const response = await fetch(`/eleves/redoublement/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            window.location.reload(); // Rafraîchir la page après mise à jour
        } else {
            const errorData = await response.json();
            alert(`Erreur : ${errorData.message}`);
        }
    } catch (error) {
        console.error("Erreur lors de la requête PUT :", error);
        alert("Une erreur est survenue. Veuillez réessayer.");
    }
}

// Ajouter des gestionnaires d'événements pour les boutons "+" et "-"
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('toggle-redouble')) {
        const id = event.target.dataset.id;
        toggleRedoublement(id);
    }
});