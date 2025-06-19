const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['earn', 'redeem'] },
  points: { type: Number, required: true },
  item: { type: String },
  reward: { type: mongoose.Schema.Types.ObjectId, ref: 'Reward', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
