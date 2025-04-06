const mongoose = require('mongoose');

const categoryWatchTimeSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  categories: [{
    category: {
      type: String,
      required: true,
    },
    watchTime: {
      type: Number,
      required: true,
    },
  }],
});

const CategoryWatchTime = mongoose.model('CategoryWatchTime', categoryWatchTimeSchema);
module.exports= CategoryWatchTime;
