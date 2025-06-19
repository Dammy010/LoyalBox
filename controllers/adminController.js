const User = require('../models/User');
const Reward = require('../models/Reward');
const Transaction = require('../models/Transaction');

// Reward CRUD
exports.createReward = async (req, res) => {
  try {
    const reward = await Reward.create(req.body);
    res.status(201).json(reward);
  } catch (err) {
    res.status(400).json({ message: 'Error creating reward' });
  }
};

exports.updateReward = async (req, res) => {
  try {
    const reward = await Reward.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(reward);
  } catch (err) {
    res.status(400).json({ message: 'Error updating reward' });
  }
};

exports.deleteReward = async (req, res) => {
  try {
    await Reward.findByIdAndDelete(req.params.id);
    res.json({ message: 'Reward deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting reward' });
  }
};

// View all users
exports.getAllUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};

// View a user's history
exports.getUserHistory = async (req, res) => {
  const history = await Transaction.find({ user: req.params.id })
    .populate('reward', 'title')
    .sort({ createdAt: -1 });
  res.json(history);
};

// Promote to admin
exports.promoteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isAdmin = true;
    await user.save();
    res.json({ message: 'User promoted to admin' });
  } catch (err) {
    res.status(400).json({ message: 'Error promoting user' });
  }
};

// ❌ Admin deletes a user (not self)
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};



