const express = require('express');

const productController = require('../controllers/productController');

const router = express.Router();
const prefix = '/products';

router.get(`${prefix}`, productController.getProducts);

router.get(`${prefix}/:id`, productController.getProductById);

router.put(`${prefix}/:id`, productController.update);

router.post(`${prefix}/:id/:quantity`, productController.subtractProductQuantityById);

router.get(`${prefix}/:id/validate/:quantity`, productController.validateProductQuantityById);

router.post(`${prefix}`, productController.save);

module.exports = router;