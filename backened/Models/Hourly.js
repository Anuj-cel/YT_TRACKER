const mongoose = require('mongoose');

const hourWatchSchema = new mongoose.Schema({
  date: String, // e.g., "2025-03-28"
  hour: Number, // 0 - 23
  duration: { type: Number, default: 0 } // Total watch time in seconds
});

module.exports = mongoose.model('HourWatch', hourWatchSchema);
