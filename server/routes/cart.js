const express = require('express');

const cartController = require('../controllers/cartController');

const router = express.Router();
const userPrefix = '/user';
const cartPrefix = 'cart';
// user/:uId/cart/doing

// /user/:uId/cart
router.post(`${userPrefix}/:uId/${cartPrefix}`, cartController.save);

// /user/:uId/cart
router.get(`${userPrefix}/:uId/${cartPrefix}`, cartController.getCart);

// /user/:uId/cart
router.put(`${userPrefix}/:uId/${cartPrefix}`, cartController.updateCart);

// /user/:uId/cart/clear
router.put(`${userPrefix}/:uId/${cartPrefix}/clear`, cartController.clearCart);

// user/:uId/cart/add 
router.post(`${userPrefix}/:uId/${cartPrefix}/add`, cartController.addItemCart);

// user/:uId/cart/subtract
router.post(`${userPrefix}/:uId/${cartPrefix}/subtract`, cartController.subtractItemCart);

module.exports = router;