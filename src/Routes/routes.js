const express = require('express');
const router = express.Router();
const controllers = require('../Controllers/Controllers');

// Route pour la page d'accueil
router.get('/', (req, res) => {
    res.render('index', {});
});

router.post('/inscription', controllers.registerEleve);

module.exports = router;