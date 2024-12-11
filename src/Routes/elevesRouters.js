const express = require('express');
const router = express.Router();
const controllers = require('../Controllers/elevesControllers');
const authe = require('../middlewares/authentification')

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

// Route pour l'inscription d'un élève
router.post('/inscription',authe, controllers.registerEleve);

// Route pour récupérer tous les élèves au format API
router.get('/eleves', controllers.listEleves);

// Route pour avancer à l'année suivante
router.post('/annee_suivante', controllers.anneesuivante);

// Route pour passer un élève en redoublement
router.put('/eleves/:id/redoublement', controllers.setRedoublement);

// Route pour modifier un élève
router.put('/eleves/:id', controllers.updateEleve);

// Route pour supprimer un élève
router.delete('/eleves/:id', authe, controllers.deleteEleve);

module.exports = router;
