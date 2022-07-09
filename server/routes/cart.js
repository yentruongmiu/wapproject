const express = require('express');

const cartController = require('../controllers/cartController');

const router = express.Router();
const userPrefix = '/user';
const cartPrefix = '/cart';
// user/:user/cart/doing

router.post(`${userPrefix}/:user/${cartPrefix}`, cartController.save);

router.get(`${userPrefix}/:user/${cartPrefix}`, cartController.getCart);

router.put(`${userPrefix}/:user/${cartPrefix}`, cartController.updateCart);

router.put(`${userPrefix}/:user/${cartPrefix}/clear`, cartController.clearCart);

module.exports = router;