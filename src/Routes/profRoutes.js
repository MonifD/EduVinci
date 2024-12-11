
/// A VERIFIER AUSSI CETTE ROUTE
const express = require('express');
const router = express.Router();
const profController = require('../Controllers/ProfControllers');

// Route pour la connexion du professeur
router.post('/login', profController.loginProfesseur);

// Route pour récupérer les classes d'un professeur
router.get('/:profId/classes', profController.getClassesForProfesseur);

module.exports = router;
