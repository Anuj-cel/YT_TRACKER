const mongoose = require('mongoose');

const categoryWatchTimeSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  month: {
    type: String, // e.g., "2025-03"
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
    isShorts:{type:Boolean,default:false}
  }],
});

const CategoryWatchTime = mongoose.model('CategoryWatchTime', categoryWatchTimeSchema);
module.exports= CategoryWatchTime;
