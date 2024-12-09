const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const { connectToDatabase, syncModels, createDatabaseIfNotExists } = require('./src/utils/database');

const { testRelations } = require('./src/data/dataInsert')

const app = express();
const port = 3000;

const routes = require('./src/Routes/routes');
const authRouter = require('./src/Routes/authRouters')



app.use(cors());
app.use(express.json());

// Configuration de l'utilisation des vues avec EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views')); // Chemin vers les vues


// Configuration de l'analyseur d'URL
app.use(express.urlencoded({ extended: true }));
// Définir le dossier public pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'src', 'public')));


app.use('/', routes);
app.use('/', authRouter);

// Fonction pour initialiser la base de données
async function initializeDatabase() {
  try {
    await createDatabaseIfNotExists();
    await connectToDatabase(); // Connexion à la base de données
    await syncModels(); // Synchronisation des modèles
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


// Point d'entrée principal
(async () => {
  try {
    await initializeDatabase(); 
    startServer(); 
  } catch (error) {
    console.error('Erreur critique lors du démarrage de l’application :', error);
  }
})();
