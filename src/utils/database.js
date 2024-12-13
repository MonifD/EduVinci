// src/Config/database.js
const { Sequelize } = require('sequelize');
const { db } = require('../Config/DbConfig');
const { sequelize } = require('../Models/model'); // Import des modèles
require('dotenv').config();


// Vérification de la connexion à la base de données et création si nécessaire
async function createDatabaseIfNotExists() {
  try {
    // Connexion sans spécifier la base de données pour vérifier la connexion au serveur
    const connection = new Sequelize({
      username: db.user,
      password: db.password,
      host: db.host,
      dialect: 'postgres',  // Changer de 'mysql' à 'postgres'
      logging: false,
    });

    await connection.authenticate();
    console.log('Connexion au serveur MySQL réussie.');

    // Vérifier si la base de données existe
    const result = await connection.query(`SHOW DATABASES LIKE '${db.database}'`);
    
    if (result[0].length === 0) {
      // Créer la base de données si elle n'existe pas
      console.log(`La base de données '${db.database}' n'existe pas. Création de la base de données...`);
      await connection.query(`CREATE DATABASE ${db.database}`);
      console.log(`Base de données '${db.database}' créée avec succès.`);
    }

    // Fermer la connexion initiale
    await connection.close();
  } catch (error) {
    console.error('Erreur lors de la création de la base de données ou de la connexion au serveur :', error);
    process.exit(1); // Arrêter le processus en cas d'erreur
  }
}

// Connexion à la base de données
async function connectToDatabase() {
  try {
    // Connexion avec la base de données après la création (si nécessaire)
    await sequelize.authenticate();
    console.log('Connexion à la base de données établie avec succès.');
  } catch (error) {
    console.error('Erreur lors de la connexion à la base de données :', error);
    process.exit(1); // Arrête le processus si la connexion échoue
  }
}

// Synchronisation des modèles avec la base de données
async function syncModels() {
  try {
    // Synchronisation une seule fois lors du premier démarrage
    if (process.env.DATABASE_SYNC_ONCE !== 'true') {
      await sequelize.sync();  // Synchroniser uniquement si nécessaire
      console.log('Modèles synchronisés avec la base de données.');
      process.env.DATABASE_SYNC_ONCE = 'true';  // Indiquer que la synchronisation a déjà eu lieu
    }
  } catch (error) {
    console.error('Erreur lors de la synchronisation des modèles :', error);
  }
}

module.exports = {
  sequelize,
  connectToDatabase,
  syncModels,
  createDatabaseIfNotExists, // Exposez la fonction pour l'utiliser ailleurs
};
