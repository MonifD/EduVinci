const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path'); // Utilisation de path pour gérer les chemins de fichiers
const { executeSQLFile } = require('./src/utils/sqlExecutor');
const { sequelize } = require('./src/Models/model');
const { testRelations } = require('./src/data/dataInsert')

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Fonction pour initialiser la base de données
async function initializeDatabase() {
  try {
    console.log('Initialisation de la base de données...');

    // Utilisation du chemin absolu avec path.join
    const sqlFilePath = path.join(__dirname, 'src', 'DataBases', 'database.sql');
    
    // Exécuter le fichier SQL
    await executeSQLFile(sqlFilePath);
    console.log('Fichier SQL exécuté avec succès.');

    await testRelations();
    console.log('Donnée importer avec succès');


    // Synchroniser Sequelize avec la base de données
    await sequelize.authenticate();
    console.log('Connexion à la base de données établie avec succès.');

    await sequelize.sync(); // Écraser et recréer les tables
    console.log('Modèles synchronisés avec la base de données.');
  } catch (error) {
    console.error('Erreur lors de l’initialisation de la base de données :', error);
    throw error; // Stopper si l'initialisation échoue
  }
}

// Fonction pour démarrer le serveur
function startServer() {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

app.get('/', (req, res) => {
  res.send('Bonjour');
});

// Point d'entrée principal
(async () => {
  try {
    await initializeDatabase(); 
    startServer(); 
  } catch (error) {
    console.error('Erreur critique lors du démarrage de l’application :', error);
  }
})();
