const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const downloadURLSchema = new Schema({
  filename: {
    type: String,
    required: true
  },
  fileURL: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});

module.exports = mongoose.model('downloadUrl', downloadURLSchema);