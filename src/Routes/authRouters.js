const express = require('express');
const router = express.Router();
const { login, register } = require('../Controllers/authControllers');
const authe = require('../middlewares/authentification');

router.get('/login',(req, res) => {
    res.render('login');
})
router.post('/login', login);

router.get('/registration', (req, res) => {
    res.render('register');
})
router.post('/registration', register);

module.exports = router;
