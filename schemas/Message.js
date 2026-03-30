const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contentMessage: {
    type: {
      type: String,
      enum: ['file', 'text'],
      required: true
    },
    content: {
      type: String,
      required: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

messageSchema.index({ from: 1, to: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);
