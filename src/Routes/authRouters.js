const express = require('express');
const router = express.Router();
const { login, register } = require('../Controllers/authControllers');
router.get('/login',(req, res) => {
    res.render('login');
})
router.post('/login', login);
router.post('/registration', register);

module.exports = router;
