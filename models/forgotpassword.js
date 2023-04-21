const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const forgotSchema = new Schema({
    _id: {
        type: Schema.Types.UUID,
        required: true
    },
    active: {
        type: Boolean,
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

module.exports = mongoose.model('Forgotpassword', forgotSchema);