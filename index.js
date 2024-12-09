const { executeSQLFile } = require('./src/utils/sqlExecutor');
const { sequelize } = require('./src/Models/model');
const path = require('path');  // Utilisation de path pour gérer les chemins de fichiers
const { testRelations } = require('./src/data/dataInsert');  // Importer la fonction testRelations

// Fonction pour synchroniser Sequelize avec la base de données
async function syncSequelize() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    await sequelize.sync({ force: true }); // Attention: Cette ligne va écraser les tables existantes
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

// Exécution du fichier SQL pour créer la base de données et les tables
(async () => {
  try {
    // Utilisation du chemin absolu avec path.join
    const sqlFilePath = path.join(__dirname, 'src', 'DataBases', 'database.sql');
    
    // Exécuter le fichier SQL
    await executeSQLFile(sqlFilePath);
    await syncSequelize();
     // Tester les relations et insérer des données
    await testRelations();  // Appeler la fonction testRelations pour insérer les données et tester les relations
  } catch (error) {
    console.error('Error during initialization:', error);
  }
})();
