const { sequelize, Professeur } = require('../Models/model'); // Import des modèles nécessaires

async function initializeProfesseurs() {
  try {
    // Synchroniser la base de données
    await sequelize.sync(); // Attention : Utilisez prudemment en production.

    // Liste des professeurs à insérer
    const professeursToInsert = [
      { nom: 'Jean', prenom: 'Dupont' },
      { nom: 'Claire', prenom: 'Martin' },
      { nom: 'Paul', prenom: 'Lefevre' },
      { nom: 'Sophie', prenom: 'Bernard' },
      { nom: 'Thierry', prenom: 'Moreau' },
      { nom: 'Isabelle', prenom: 'Dufresne' },
      { nom: 'François', prenom: 'Lemoine' },
      { nom: 'Catherine', prenom: 'Dubois' },
    ];

    // Parcourir la liste et utiliser `findOrCreate` pour chaque professeur
    for (const professeur of professeursToInsert) {
      await Professeur.findOrCreate({
        where: {
          nom: professeur.nom,
          prenom: professeur.prenom,
        },
      });
    }

    console.log('Professeurs initialisés avec succès.');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des professeurs :', error);
    throw error;
  }
}

module.exports = { initializeProfesseurs };
