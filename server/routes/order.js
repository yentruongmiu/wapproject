const express = require('express');

const orderController = require('../controllers/orderController');

const router = express.Router();
const userPrefix = '/user';
const orderPrefix = '/orders';

// /orders/user/:uId
router.post(`${orderPrefix}${userPrefix}/:uId`, orderController.save);

router.get(`${orderPrefix}`, orderController.getOrders);

// /orders/user/:uId/validate-order
router.post(`${orderPrefix}${userPrefix}/:uId/validate-order`, orderController.validateOrderBeforeSaving);

module.exports = router;