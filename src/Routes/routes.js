const express = require('express');
const router = express.Router();

// Route pour la page d'accueil
router.get('/', (req, res) => {
    res.render('index', {});
});

router.post('/inscription', )

module.exports = router;