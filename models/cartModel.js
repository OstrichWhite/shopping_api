const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'User',
      select: false,
    },
    product: {type: mongoose.Schema.Types.ObjectId, ref:'Product'},
  },
  {
    timestamps: true, 
  }
);

cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'product',
    select: 'name amount quantity description -_id',
  })

  next();
});

const Cart = mongoose.model('Cart',cartSchema);
module.exports = Cart;