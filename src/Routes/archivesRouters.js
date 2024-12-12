const express = require('express');
const router = express.Router();
const controllers = require('../Controllers/archivesControllers');

// Route pour récupérer toutes les archives
router.get('/archives', controllers.getAllArchives);

module.exports = router;
