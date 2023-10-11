const express = require('express');

const { register, login, logout, getUserDetails } = require('../controllers/user');
const validate = require('../middlewares/validate');
const validations = require('../validations');

const router = express.Router();

router.post('/register', validate(validations.user.register), register);

router.post('/login', login);

router.get('/details/:id', getUserDetails);

router.get('/logout', logout);

module.exports = router;
