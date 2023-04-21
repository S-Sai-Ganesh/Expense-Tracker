const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const expenseSchema = new Schema({
  description: {
    type: String
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});

module.exports = mongoose.model('Expense', expenseSchema);