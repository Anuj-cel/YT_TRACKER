const mongoose = require('mongoose');

const hourWatchSchema = new mongoose.Schema({
  date: String,
  hour: Number,
  duration: { type: Number, default: 0 } 
});

module.exports = mongoose.model('HourWatch', hourWatchSchema);
