const express = require('express');
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getMe,
  updateMe,
  deleteMe,
  getOrders,
  getCart
} = require('../controllers/userController');

const {
  signUp,
  login,
  updatePassword,
  protect,
  restrictTo,
} = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);

// Protect all routes after this middleware (Needs Log In - Authentication)
router.use(protect);

router.get('/me', getMe, getUser);
router.patch('/updateMyPassword', updatePassword);
router.patch('/updateMe', updateMe);
router.delete('/deleteMe', deleteMe);
router.route('/get-orders').get(restrictTo('user'), getOrders)
router.route('/get-cart').get(restrictTo('user'), getCart)

// All route after this middleware are restricted to admin (Authorization)
router.use(restrictTo('admin')); 

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
