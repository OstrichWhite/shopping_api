const mongoose = require('mongoose');
const validator = require('validator');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product must have name'],
      unique: true,
    },
    amount: {
      type: String,
      required: [true, 'Product must have amount'],
      validate: [validator.isFloat, 'Please provide a valid amount'],
    },
    quantity: {
      type: String,
      default: 1,
      validate: [validator.isInt, 'Please provide a valid quantity'],
    },
    description: String,
    
  },
  {
    timestamps: true, 
  }
);


const Product = mongoose.model('Product',productSchema);
module.exports = Product;