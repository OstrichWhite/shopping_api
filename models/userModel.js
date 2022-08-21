const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name!'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Please provide your phone number'],
      unique: true,
      validate: [validator.isMobilePhone, 'Please provide a valid phone number'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please Confirm your password'],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: 'Password must be same',
      },
    },
    cart: [{type: mongoose.Schema.Types.ObjectId, ref:'Product'}],
    orders: [{type: mongoose.Schema.Types.ObjectId, ref:'Product'}],
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    timestamps: true, 
  }
);

// mongoose middlewares
userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined; //dont need to store in DB just for verification
  next();
});

// userSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'cart',
//     select: 'name amount quantity -_id',
//   }).populate({
//     path: 'orders',
//     select: 'name amount quantity -_id',
//   });
//   next();
// });

// mongoose methods
userSchema.methods.correctPassword = async function (inputPassword, userPassword) {
  return await bcrypt.compare(inputPassword, userPassword);
};


const User = mongoose.model('User',userSchema);
module.exports = User;