const { sequelize, Professeur } = require('../Models/model'); // Import des modèles nécessaires

async function initializeProfesseurs() {
  try {
    // Synchroniser la base de données
    await sequelize.sync(); // Attention : Utilisez prudemment en production.

    // Liste des professeurs à insérer
    const professeursToInsert = [
      { genre: 'M.', nom: 'Jean', prenom: 'Dupont' },
      { genre: 'Mme.', nom: 'Claire', prenom: 'Martin' },
      { genre: 'M.', nom: 'Paul', prenom: 'Lefevre' },
      { genre: 'Mlle.', nom: 'Sophie', prenom: 'Bernard' },
      { genre: 'M.', nom: 'Thierry', prenom: 'Moreau' },
      { genre: 'Mme.', nom: 'Isabelle', prenom: 'Dufresne' },
      { genre: 'M.', nom: 'François', prenom: 'Lemoine' },
      { genre: 'Mme.', nom: 'Catherine', prenom: 'Dubois' },
    ];

    // Parcourir la liste et utiliser `findOrCreate` pour chaque professeur
    for (const professeur of professeursToInsert) {
      await Professeur.findOrCreate({
        where: {
          nom: professeur.nom,
          prenom: professeur.prenom,
        },
        defaults: {
          genre: professeur.genre,
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
