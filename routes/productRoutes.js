const express = require('express');
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addToCart,
  removeFromCart,
  placeOrder,
} = require('../controllers/productController');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router({ mergeParams: true }); // POST|GET /tour/234acd74/Products // POST|GET /Products

// Protect all routes after this middleware (Needs Log In - Authentication)
router.use(protect);

router
  .route('/')
  .get(getAllProducts)
  .post(restrictTo('admin'), createProduct); //Authorization [restricted to admin]

router
  .route('/:id')
  .get(getProduct)
  .patch(restrictTo('admin'), updateProduct) //Authorization [restricted to admin]
  .delete(restrictTo('admin'), deleteProduct); //Authorization [restricted to admin]
  
router.route('/:id/add-to-cart').post(restrictTo('user'), addToCart)
router.route('/:id/remove-from-cart').post(restrictTo('user'), removeFromCart)
router.route('/:id/place-order').post(restrictTo('user'), placeOrder)


module.exports = router;
