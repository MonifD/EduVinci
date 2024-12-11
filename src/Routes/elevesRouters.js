const express = require('express');
const router = express.Router();
const controllers = require('../Controllers/Controllers');
const elevesControllers = require('../Controllers/elevesControllers');
const anneesControllers = require('../Controllers/anneesControllers');

// Route pour la page d'accueil
router.get('/', (req, res) => {
    res.render('index', {});
});

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

        res.render('liste_eleves', { eleves });
    } catch (error) {
        console.error('Erreur lors du chargement de la liste des élèves :', error);
        res.status(500).send('Une erreur est survenue.');
    }
});

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

router.post('/inscription', elevesControllers.registerEleve);
router.get('/eleves', controllers.listEleves);

// Route pour avancer à l'année suivante
router.post('/annee_suivante', controllers.anneesuivante);

// Route pour passer un élève en redoublement
router.put('/eleves/:id/redoublement', controllers.setRedoublement);

// Route pour modifier un élève
router.put('/eleves/:id', controllers.updateEleve);

// Route pour supprimer un élève
router.delete('/eleves/:id', controllers.deleteEleve);

module.exports = router;
