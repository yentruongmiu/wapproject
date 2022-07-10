const express = require('express');

const cartController = require('../controllers/cartController');

const router = express.Router();
const userPrefix = '/user';
const cartPrefix = '/cart';
// user/:uId/cart/doing

router.post(`${userPrefix}/:uId/${cartPrefix}`, cartController.save);

router.get(`${userPrefix}/:uId/${cartPrefix}`, cartController.getCart);

router.put(`${userPrefix}/:uId/${cartPrefix}`, cartController.updateCart);

router.put(`${userPrefix}/:uId/${cartPrefix}/clear`, cartController.clearCart);

module.exports = router;