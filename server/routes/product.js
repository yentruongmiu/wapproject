const express = require('express');

const productController = require('../controllers/productController');

const router = express.Router;
const prefix = '/products';

router.get(`${prefix}`, productController.getProducts);

router.get(`${prefix}/:id`, productController.getProductById);

router.put(`${prefix}/:id`, productController.update);

router.put(`${prefix}/:id/:quantity`, productController.updateQuantityById);

router.get(`${prefix}/:id/validate/:quantity`, productController.validateQuantityById);

module.exports = router;