const express = require('express');
const path = require('path');
const multer = require('multer');
const controllers = require('../Controllers/elevesControllers');
const anneesControllers = require('../Controllers/anneesControllers');
const authe = require('../middlewares/authentification');

const router = express.Router();

// Configurer multer pour le téléchargement de fichiers
const upload = multer({ dest: "src/uploads/" });


// Route pour la page d'accueil
router.get('/', (req, res) => {
    res.render('accueil');
});

// Route pour afficher l'histoire du groupe scolaire
router.get('/historique', (req, res) => {
    res.render('historique'); // Rend la vue historique.ejs
   
});

// Route pour afficher la liste des élèves dans le back
router.post('/liste_eleves', controllers.listEleves);
// Route pour afficher la liste des élèves dans une vue
router.get('/liste_eleves', async (req, res) => {
    try {
        const eleves = await new Promise((resolve, reject) => {
            const mockRes = {
                status: () => mockRes,
                json: (data) => resolve(data),
                send: reject,
            };
            controllers.listEleves(req, mockRes);
        });

        res.render('liste_eleves', {eleves }); // changé les routes pour ne pas afficher l'image 
    } catch (error) {
        console.error('Erreur lors du chargement de la liste des élèves :', error);
        res.status(500).send('Une erreur est survenue.');
    }
});


// Route pour afficher le formulaire d'inscription
router.get('/inscription', async (req, res) => {
    try {
        // Appel de la méthode du contrôleur anneesControllers
        const annees = await new Promise((resolve, reject) => {
            const mockRes = {
                status: () => mockRes,
                json: (data) => resolve(data),
                send: reject,
            };
            anneesControllers.getAllAnnees(req, mockRes);
        });

        // Rendu de la vue avec les années récupérées
        res.render('inscription_eleve', { annees });
    } catch (error) {
        console.error('Erreur lors du chargement des années scolaires :', error);
        res.status(500).send('Une erreur est survenue.');
    }
});

// Route pour inscrire un élève
router.post('/inscription', controllers.registerEleve);
router.get('/annee_suivante', (req, res) => { res.render('annee_suivante') });
// Route pour avancer à l'année suivante
router.post('/annee_suivante', authe, controllers.anneeSuivante);

// Route pour passer un élève en redoublement
router.put('/eleves/redoublement/:id', authe, controllers.setRedoublement);

// Route pour modifier un élève
router.put('/eleves/:id', authe, controllers.updateEleve);

// Route pour supprimer un élève
router.delete('/eleves/:id', authe, controllers.deleteEleve);

// Route pour afficher le formulaire d'importation
router.get('/import', (req, res) => {
    res.render('import_csv', {});
});

// Route pour gérer l'importation de fichiers CSV
router.post('/import', upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Aucun fichier téléchargé.' });
        }

        const filePath = req.file.path;
        await controllers.importEleves(filePath);
        res.status(200).json({ message: 'Importation réussie.' });
    } catch (error) {
        console.error('Erreur lors de l\'importation des élèves :', error);
        res.status(500).json({
            message: 'Une erreur est survenue lors de l\'importation des élèves.',
            error: error.message,
        });
    }
});

// Route pour exporter les élèves vers un fichier CSV
router.get('/export', async (req, res) => {
    try {
      const exportsDir = path.resolve(__dirname, '../exports');
      const filePath = path.join(exportsDir, 'eleves_export.csv');
  
      await controllers.exportEleves();
  
      // Fournir le chemin du fichier à télécharger
      res.download(filePath, 'eleves_export.csv', (err) => {
        if (err) {
          console.error('Erreur lors du téléchargement du fichier :', err);
          res.status(500).json({
            message: 'Une erreur est survenue lors du téléchargement du fichier.',
            error: err.message,
          });
        }
      });
    } catch (error) {
      console.error('Erreur lors de l\'exportation des élèves :', error);
      res.status(500).json({
        message: 'Une erreur est survenue lors de l\'exportation des élèves.',
        error: error.message,
      });
    }
});

router.get('/liste_redoublants', async (req, res) => {
    try {
        const eleves = await new Promise((resolve, reject) => {
            const mockRes = {
                status: () => mockRes,
                json: (data) => resolve(data),
                send: reject,
            };
            controllers.listEleves(req, mockRes);
        });

        res.render('liste_redoublants', { eleves });
    } catch (error) {
        console.error('Erreur lors du chargement de la liste des élèves :', error);
        res.status(500).send('Une erreur est survenue.');
    }
});

module.exports = router;
