const { sequelize, User } = require('../Models/model'); // Import des modèles nécessaires
const bcrypt = require('bcrypt');
require('dotenv').config();

async function initializeUsers() {
  try {
    // Synchroniser la base de données
    await sequelize.sync(); // Attention : Utilisez prudemment en production.

    // Liste des utilisateurs à insérer
    const users = [
      { nom: 'admin', prenom: 'admin', email: "admin@gmail.fr", password: process.env.MDP_ADMIN, role: 'Maire' },
    ];

    for (const user of users) {
      // Hacher le mot de passe
      const hashedPassword = await bcrypt.hash(user.password, 10);

      // Trouver ou créer l'utilisateur
      await User.findOrCreate({
        where: { email: user.email }, // Critère de recherche
        defaults: { // Données à insérer si l'utilisateur n'existe pas
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          password: hashedPassword,
          role: user.role,
        },
      });
    }

    console.log('Users initialisés avec succès.');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des users :', error);
    throw error;
  }
}

module.exports = { initializeUsers };
