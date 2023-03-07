const express = require('express');

const { register, login, logout, userDetails } = require('../controllers/user');

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.get('/details/:id', userDetails);

router.get('/logout', logout);

module.exports = router;
