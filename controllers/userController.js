const User = require('../models/userModel');
const Orders = require('../models/ordersModel');
const Cart = require('../models/cartModel');
const factory = require('./handlerFactory');

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = async (req, res, next) => {
  try{
    // 1) Create error if user POSTs a password data
    if (req.body.password || req.body.passwordConfirm) {
      return res.status(400).json({
        status: 'fail',
        message: 'This route is not for password update',
      })
    }
    // 2) Filter Out the unwanted fields that are not allowed to be updated
    const filteredBody = factory.filterObj(req.body, 'name', 'email', 'phone');
  
    // 3) update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true,
    });
  
    res.status(200).json({
      status: 'Success',
      data: {
        user: updatedUser,
      },
    });
  }
  catch(err){
    return res.status(500).json({ status: 'error', message: err.message, data: err })
  }
};

exports.deleteMe = async (req, res, next) => {
  try{
    await User.findByIdAndUpdate(req.user.id, { active: false });
    return res.status(204).json({
      status: 'success',
      data: null,
    });
  }
  catch(err){
    return res.status(500).json({ status: 'error', message: err.message, data: err })
  }
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined please use /signup instead',
  });
};

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User); // Do NOT update password with this!
exports.deleteUser = factory.deleteOne(User);
exports.getOrders = async (req, res) => {
  try{
    const doc = await Orders.find({user: req.user.id});
    
    if (!doc) {
      return res.status(404).json({
        status: 'fail',
        message: 'No document found with that ID',
      })
    }
    res.status(200).json({ status: 'success', data: { data: doc } });
    
  }catch(err){
    return res.status(500).json({ status: 'error', message: err.message, data: err })
  }
};
exports.getCart = async (req, res) => {
  try{
    const doc = await Cart.find({user: req.user.id});
    
    if (!doc) {
      return res.status(404).json({
        status: 'fail',
        message: 'No document found with that ID',
      })
    }
    res.status(200).json({ status: 'success', data: { data: doc } });
    
  }catch(err){
    return res.status(500).json({ status: 'error', message: err.message, data: err })
  }
};
// exports.getOrders = factory.getAll(Orders);
// exports.getCart = factory.getAll(Cart);