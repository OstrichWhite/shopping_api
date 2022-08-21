const User = require('../models/userModel');
const Product = require('../models/productModel');
const Orders = require('../models/ordersModel');
const Cart = require('../models/cartModel');
const mongoose = require('mongoose')
const factory = require('./handlerFactory');

exports.getAllProducts = factory.getAll(Product);
exports.getProduct = factory.getOne(Product);
exports.createProduct = factory.createOne(Product);
exports.updateProduct = factory.updateOne(Product);
exports.deleteProduct = factory.deleteOne(Product);

exports.addToCart= (req,res)=>{
  let productId = req.params.id;
  if(!mongoose.Types.ObjectId.isValid(productId)){
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid Product Id',
    })
  }

  Product.findOne({_id:productId})
  .then(async product => {
    if(!product){
      return res.status(400).json({
        status: 'fail',
        message: 'There is no such product',
      })
    }
      
    let currentUser=req.user;

    Cart.findOne({ product: productId, user: currentUser._id })
    .then(async cart => {
      try {
        if(!cart){
          let cartDoc = new Cart({ product: productId, user: currentUser._id })
          let cartData = await cartDoc.save()
          await User.updateOne({ _id:currentUser._id },{ $push: { cart: productId }})

          return res.status(200).json({
            status: 'success',
            message: 'Product added to Cart successfully'
          })
        }
        else{
          return res.status(200).json({
            status: 'success',
            message: 'Product already added to Cart'
          })
        }
      }

      catch(err){
        return res.status(500).json({ status: 'error', message: err.message, data: err })
      } 

    })

    .catch((err)=>{
      return res.status(500).json({ status: 'error', message: err.message, data: err })
    })
    
  });
}

exports.removeFromCart= (req,res)=>{
  let productId = req.params.id;
  if(!mongoose.Types.ObjectId.isValid(productId)){
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid Product Id',
    })
  }

  Product.findOne({_id:productId})
  .then(async product => {
    if(!product){
      return res.status(400).json({
        status: 'fail',
        message: 'There is no such product',
      })
    }
      
    let currentUser=req.user;

    Cart.findOne({ product: productId, user: currentUser._id })
    .then(async cart => {
      try {
        if(cart){
          await Cart.deleteOne({ product: productId, user: currentUser._id })
          await User.updateOne({ _id:currentUser._id },{ $pull: { cart: productId }})

          return res.status(200).json({
            status: 'success',
            message: 'Product removed from Cart successfully'
          })
        }
        else{
          return res.status(200).json({
            status: 'success',
            message: 'Product not available in Cart'
          })
        }
      }

      catch(err){
        return res.status(500).json({ status: 'error', message: err.message, data: err })
      } 

    })

    .catch((err)=>{
      return res.status(500).json({ status: 'error', message: err.message, data: err })
    })
    
  });
}

exports.placeOrder= (req,res)=>{
  let productId = req.params.id;
  if(!mongoose.Types.ObjectId.isValid(productId)){
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid Product Id',
    })
  }

  Product.findOne({_id:productId})
  .then(async product => {
    if(!product){
      return res.status(400).json({
        status: 'fail',
        message: 'There is no such product',
      })
    }
      
    let currentUser=req.user;

    Orders.findOne({ product: productId, user: currentUser._id })
    .then(async order => {
      try {
        if(!order){
          let orderDoc = new Orders({ product: productId, user: currentUser._id })
          let orderData = await orderDoc.save()
          await User.updateOne({ _id:currentUser._id },{ $push: { orders: productId }})

          return res.status(200).json({
            status: 'success',
            message: 'Order placed successfully'
          })
        }
        else{
          return res.status(200).json({
            status: 'success',
            message: 'Order already placed'
          })
        }
      }

      catch(err){
        return res.status(500).json({ status: 'error', message: err.message, data: err })
      } 

    })

    .catch((err)=>{
      return res.status(500).json({ status: 'error', message: err.message, data: err })
    })
    
  });
}