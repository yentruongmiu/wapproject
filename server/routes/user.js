const express = require('express');

const userController = require('../controllers/userController');
const router = express.Router();

const prefix = '/users';

router.post(`${prefix}/login`, userController.login);

router.get(`${prefix}/logout`, userController.logout);

router.get(`${prefix}/authorization`, userController.authorization);

module.exports = router;
