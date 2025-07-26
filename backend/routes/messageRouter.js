const express = require('express');
const router = express.Router();
const Message = require('../models/messageModel');
const User = require('../models/userModel');
const userAuthCheck = require('../middlewares/auth');

// All message routes require auth


// Get all conversations for the logged-in user
router.get('/user/conversations',userAuthCheck, async (req, res) => {
  try {
    const userId = req.user._id;

    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    }).sort({ timestamp: 1 });

    const conversations = {};
    for (const msg of messages) {
      const otherId =
        String(msg.sender) === String(userId)
          ? String(msg.receiver)
          : String(msg.sender);
      if (!conversations[otherId]) conversations[otherId] = [];
      conversations[otherId].push(msg);
    }

    const result = await Promise.all(
      Object.entries(conversations).map(async ([otherId, msgs]) => {
        const otherUser = await User.findById(otherId);
        return {
          user: otherUser,
          messages: msgs,
          lastMessage: msgs[msgs.length - 1],
        };
      })
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get messages between logged-in user and another user
router.get('/user/messages/:otherId', userAuthCheck,async (req, res) => {
  try {
    const userId = req.user._id;
    const otherId = req.params.otherId;

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherId },
        { sender: otherId, receiver: userId },
      ],
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
