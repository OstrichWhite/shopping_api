const mongoose = require('mongoose');

const ordersSchema = new mongoose.Schema(
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

ordersSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'product',
    select: 'name amount quantity description -_id',
  })
  // .populate({
  //   path: 'user',
  //   select: 'name',
  // });
  next();
});

const Orders = mongoose.model('Orders',ordersSchema);
module.exports = Orders;