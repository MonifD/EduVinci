const express = require('express');
const router = express.Router();
const controllers = require('../Controllers/anneesControllers');
const authe = require('../middlewares/authentification');


// Route pour la page d'accueil (facultatif, peut être modifié selon besoin)
router.get('/', (req, res) => {
    res.render('index', {});
});

// Route pour récupérer la liste des années
router.get('/liste_annees', async (req, res) => {
    try {
        // Appel du contrôleur
        const annees = await new Promise((resolve, reject) => {
            const mockRes = {
                status: () => mockRes,
                json: (data) => resolve(data),
                send: reject,
            };
            controllers.getAllAnnees(req, mockRes);
        });

        // Rendu de la vue avec les données récupérées
        res.render('liste_annees', { annees });
    } catch (error) {
        console.error('Erreur lors du chargement de la liste des années :', error);
        res.status(500).send('Une erreur est survenue.');
    }
});

// Route pour récupérer toutes les années (format API)
router.get('/annees', authe, controllers.getAllAnnees);

module.exports = router;
