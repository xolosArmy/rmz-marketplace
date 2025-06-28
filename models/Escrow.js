const mongoose = require('mongoose');

const { Schema } = mongoose;

const escrowSchema = new Schema({
  orderId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  buyer: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  seller: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  amountXEC: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['LOCKED', 'RELEASED', 'DISPUTE'],
    default: 'LOCKED',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Escrow', escrowSchema);
