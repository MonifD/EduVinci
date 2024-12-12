const express = require('express');
const ProfControllers = require('../Controllers/ProfControllers');
const { Professeur, Classe } = require('../Models/model');
const authe = require('../middlewares/authentification');

const router = express.Router();

// Routes pour gérer les professeurs
router.post('/professeurs/create', authe, ProfControllers.registerProfesseur);
router.get('/professeurs/list', authe, ProfControllers.listProfesseurs);
router.put('/professeurs/:id', authe, ProfControllers.updateProfesseur);
router.delete('/professeurs/:id', authe, ProfControllers.deleteProfesseur);

// Route pour assigner un professeur à une classe
router.post('/professeurs/assigne', authe, ProfControllers.assignProfToClass);

// Route pour lister les classes
router.get('/Classes', authe, ProfControllers.findAllClasses);

// Route pour afficher le formulaire d'assignation
router.get('/assignerProf', async (req, res) => {
    try {
        const professeurs = await Professeur.findAll({ attributes: ['id', 'nom', 'prenom'] });
        let classes = await Classe.findAll({ attributes: ['id', 'libelle'] });

        // Exclusion des classes non désirées
        classes = classes.filter(classe => classe.libelle !== 'Pré-inscription' && classe.libelle !== 'Classe non déterminée');

        res.render('assign_prof', { professeurs, classes });
    } catch (error) {
        console.error('Erreur lors du chargement des données pour l\'assignation :', error);
        res.status(500).send(`Erreur du serveur : ${error.message}`);
    }
});

module.exports = router;
