const express = require('express');
const router = express.Router();
const {
  getMessagesWithUser,
  sendMessage,
  getLatestMessages
} = require('../controllers/messages');

// Mock auth middleware - replace with actual auth in production
const authMiddleware = (req, res, next) => {
  // In production, verify token from headers
  // For demo purposes, using a hardcoded user ID
  const userId = req.headers['x-user-id'];
  
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized - User ID required in x-user-id header' });
  }
  
  req.user = { id: userId };
  next();
};

router.use(authMiddleware);

// GET /messages/:userID - Get all messages between current user and specific user
router.get('/:userID', getMessagesWithUser);

// POST /messages - Send a new message
router.post('/', sendMessage);

// GET /messages - Get latest message from each conversation
router.get('/', getLatestMessages);

module.exports = router;
