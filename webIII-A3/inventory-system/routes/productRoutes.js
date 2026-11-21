const express = require('express');
const ctrl = require('../controllers/productController');
const validateId = require('../middleware/validateId');

const router = express.Router();

// Static routes MUST come before '/:id' or "low-stock" would be treated as an id
router.get('/low-stock', ctrl.getLowStock);
router.get('/summary', ctrl.getCategorySummary);

router.route('/').get(ctrl.getProducts).post(ctrl.createProduct);

router.patch('/:id/stock', validateId, ctrl.adjustStock);

router
  .route('/:id')
  .get(validateId, ctrl.getProductById)
  .put(validateId, ctrl.updateProduct)
  .delete(validateId, ctrl.deleteProduct);

module.exports = router;
