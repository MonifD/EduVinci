const express = require('express');
const router = express.Router();
const controllers = require('../Controllers/Controllers');
const elevesControllers = require('../Controllers/elevesControllers');
const anneesControllers = require('../Controllers/anneesControllers');

// Route pour la page d'accueil
router.get('/', (req, res) => {
    res.render('index', {});
});

router.get('/liste_eleves', async (req, res) => {
    try {
        // Appel du contrôleur
        const eleves = await new Promise((resolve, reject) => {
            const mockRes = {
                status: () => mockRes,
                json: (data) => resolve(data),
                send: reject,
            };
            controllers.listEleves(req, mockRes);
        });

        // Rendu de la vue avec les données récupérées
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

module.exports = router;