const express = require('express');

const { register, login, logout, getUserDetails } = require('../controllers/user');

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.get('/details/:id', getUserDetails);

router.get('/logout', logout);

module.exports = router;
