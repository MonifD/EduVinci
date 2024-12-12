const express = require('express');
const ProfControllers = require('../Controllers/ProfControllers');
const router = express.Router();


router.post('/professeurs/create', ProfControllers.registerProfesseur); // Crée un nouveau professeur, avec authentification 
router.get('/professeurs/list', ProfControllers.listProfesseurs); // pour la liste des profs 
router.put('/professeurs/:id', ProfControllers.updateProfesseur); // Route pour mettre à jour un professeur
router.delete('/professeurs/:id', ProfControllers.deleteProfesseur); // Route pour supprimer un professeur
router.post('/professeurs/assigne', ProfControllers.assignProfToClass); // Route pour assigner un prof a une classe
router.get('/Classes', ProfControllers.findAllClasses); // Route pour afficher tout les classes



module.exports = router;
