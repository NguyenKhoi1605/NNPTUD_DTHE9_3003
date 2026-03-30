const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const messagesRouter = require('./routes/messages');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect('mongodb+srv://knguyenduc499_db_user:pB7BHFui4TEI91dL@cluster0.mwgnw6w.mongodb.net/', {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  tls: true,
  tlsInsecure: true,
});

mongoose.connection.on('connected', function () {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', function (err) {
  console.error('MongoDB connection error:', err);
});

// Routes
app.use('/api/messages', messagesRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;
