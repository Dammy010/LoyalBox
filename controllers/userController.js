const User = require('../models/User');
const Reward = require('../models/Reward');
const Transaction = require('../models/Transaction');

// ✅ View available rewards
exports.getAllRewards = async (req, res) => {
  try {
    const rewards = await Reward.find();
    res.json(rewards);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch rewards' });
  }
};

// Buy item and earn points
exports.buyItem = async (req, res) => {
  try {
    const { itemName, pointsEarned } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.points += pointsEarned;
    await user.save();

    const transaction = await Transaction.create({
      user: user._id,
      type: 'earn',
      item: itemName,
      points: pointsEarned,
    });

    res.status(200).json({ message: 'Item bought, points added', points: user.points, transaction });
  } catch (err) {
    console.error('Buy error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Redeem a reward
exports.redeem = async (req, res) => {
  const { rewardId } = req.body;

  try {
    const reward = await Reward.findById(rewardId);
    const user = await User.findById(req.user.id);

    // ✅ Check if reward exists
    if (!reward) {
      return res.status(404).json({ message: 'Reward not found' });
    }

    // ✅ Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ✅ Check if user has enough points
    if (user.points < reward.cost) {
      return res.status(400).json({ message: 'Not enough points' });
    }

    // Deduct points and save user
    user.points -= reward.cost;
    await user.save();

    // Log transaction
    await Transaction.create({
      user: user._id,
      type: 'redeem',
      points: reward.cost,
      reward: reward._id,
    });

    res.json({
      message: 'Reward redeemed',
      reward: reward.title,
      remainingPoints: user.points,
    });
  } catch (err) {
    console.error('Redeem error:', err);
    res.status(500).json({ message: 'Error redeeming reward' });
  }
};


// Get transaction history
exports.getHistory = async (req, res) => {
  try {
    const history = await Transaction.find({ user: req.user.id })
      .populate('reward', 'title cost')
      .sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching history' });
  }
};

// User deletes self
exports.deleteSelf = async (req, res) => {
  try {
    const userId = req.user.id;

    await Transaction.deleteMany({ user: userId });
    await User.findByIdAndDelete(userId);

    res.json({ message: 'Your account has been deleted' });
  } catch (err) {
    console.error('Error deleting self:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
