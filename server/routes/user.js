const express = require('express');

const userController = require('../controllers/userController');
const auth = require('../auth');
const router = express.Router();

const prefix = '/users';

router.post(`${prefix}/login`, userController.login);

router.get(`${prefix}/logout`, auth, userController.logout);

router.get(`${prefix}/authentication`, auth, userController.authentication);

module.exports = router;
