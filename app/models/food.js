var mongoose = require('mongoose');

module.exports = mongoose.model('Food', new mongoose.Schema({
  name: {
    type: String
  },
  price: {
    type: Number
  },
  _creator: {
    type: mongoose.Schema.ObjectId,
    ref: 'Order'
  }
}));
