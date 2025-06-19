const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  title: String,
  description: String,
  cost: Number,
}, { timestamps: true });

module.exports = mongoose.model('Reward', rewardSchema);
