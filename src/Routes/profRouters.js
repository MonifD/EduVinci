const express = require('express');
const ProfControllers = require('../Controllers/ProfControllers');
const router = express.Router();


router.post('/create', ProfControllers.registerProfesseur); // Crée un nouveau professeur, avec authentification 
router.get('/list', ProfControllers.listProfesseurs); // pour la liste des profs 
router.put('/:id', ProfControllers.updateProfesseur); // Route pour mettre à jour un professeur
router.delete('/:id', ProfControllers.deleteProfesseur); // Route pour supprimer un professeur



module.exports = router;
