var mongoose = require('mongoose');

module.exports = mongoose.model('Order', new mongoose.Schema({
  total_cost: {
    type: Number
  },
  order_date: {
    type: Date,
    default: Date.now
  },
  foods: [{
    type: mongoose.Schema.ObjectId, ref: 'Food'
  }]
}));
