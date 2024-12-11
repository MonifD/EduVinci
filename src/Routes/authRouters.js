const express = require('express');
const router = express.Router();
const { login, register } = require('../Controllers/authControllers');

router.post('/login', login);
router.post('/registration', register);

router.get('/registration', (req, res) => {
    res.render('register');
})

module.exports = router;
