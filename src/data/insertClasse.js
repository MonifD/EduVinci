const { sequelize, Classe } = require('../Models/model'); // Import des modèles nécessaires

async function initializeClasses() {
  try {
    // Synchroniser la base de données
    await sequelize.sync(); // Attention : Utilisez prudemment en production.

    // Liste des classes à insérer
    const classesToInsert = [
      "Pré-inscription",
      "1ère section maternelle",
      "2ème section maternelle",
      "3ème section maternelle",
      "CP",
      "CE1",
      "CE2",
      "CM1",
      "CM2",
    ];

    // Parcourir la liste et utiliser `findOrCreate` pour chaque classe
    for (const libelle of classesToInsert) {
      await Classe.findOrCreate({
        where: { libelle }, // Vérifie si une classe avec ce libellé existe déjà
      });
    }

    console.log('Classes initialisées avec succès.');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des classes :', error);
    throw error;
  }
}

module.exports = { initializeClasses };
