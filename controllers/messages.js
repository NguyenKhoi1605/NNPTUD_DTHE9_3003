const Message = require('../schemas/Message');

// Get all messages between current user and a specific user
const getMessagesWithUser = async (req, res) => {
  try {
    const currentUserId = req.user.id; // Assuming auth middleware sets req.user
    const { userID } = req.params;

    if (!userID) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const messages = await Message.find({
      $or: [
        { from: currentUserId, to: userID },
        { from: userID, to: currentUserId }
      ]
    }).sort({ createdAt: 1 });

    res.json({ success: true, data: messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// Send a new message
const sendMessage = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { to, contentMessage } = req.body;

    if (!to) {
      return res.status(400).json({ error: 'Recipient user ID is required' });
    }

    if (!contentMessage || !contentMessage.type || !contentMessage.content) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    if (!['file', 'text'].includes(contentMessage.type)) {
      return res.status(400).json({ error: 'Message type must be "file" or "text"' });
    }

    const message = new Message({
      from: currentUserId,
      to,
      contentMessage: {
        type: contentMessage.type,
        content: contentMessage.content
      }
    });

    await message.save();

    res.status(201).json({ success: true, data: message });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// Get latest message from each user conversation
const getLatestMessages = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    // Get all messages where current user is involved
    const messages = await Message.find({
      $or: [
        { from: currentUserId },
        { to: currentUserId }
      ]
    }).sort({ createdAt: -1 });

    // Group by the other user and get the latest message for each
    const latestMessagesMap = new Map();

    messages.forEach(message => {
      const otherUserId = message.from.toString() === currentUserId 
        ? message.to.toString() 
        : message.from.toString();

      if (!latestMessagesMap.has(otherUserId)) {
        latestMessagesMap.set(otherUserId, message);
      }
    });

    const latestMessages = Array.from(latestMessagesMap.values());

    res.json({ success: true, data: latestMessages });
  } catch (error) {
    console.error('Error fetching latest messages:', error);
    res.status(500).json({ error: 'Failed to fetch latest messages' });
  }
};

module.exports = {
  getMessagesWithUser,
  sendMessage,
  getLatestMessages
};
