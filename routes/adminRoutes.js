const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');
const {
  createReward,
  updateReward,
  deleteReward,
  getAllUsers,
  getUserHistory,
  promoteUser,
  deleteUser // 👈 Add this line
} = require('../controllers/adminController');

router.use(protect, isAdmin);

// User management routes
router.get('/users', getAllUsers);
router.get('/user/:id/history', getUserHistory);
router.patch('/promote/:id', promoteUser);
router.delete('/users/:id', deleteUser); // 👈 Add this route

// Reward management routes
router.post('/rewards', createReward);
router.put('/rewards/:id', updateReward);
router.delete('/rewards/:id', deleteReward);

module.exports = router;
