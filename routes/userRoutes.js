const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  buyItem,
  redeem,
  getHistory,
  deleteSelf,
  getAllRewards // ✅ Import the function
} = require('../controllers/userController');

router.get('/rewards', protect, getAllRewards); // ✅ View available rewards
router.post('/buy', protect, buyItem);
router.post('/redeem', protect, redeem);
router.get('/history', protect, getHistory);
router.delete('/me', protect, deleteSelf);

module.exports = router;
