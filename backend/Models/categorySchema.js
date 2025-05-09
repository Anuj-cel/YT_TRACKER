const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const categoryVideoSchema = new Schema({
  videoId: {
    type: String, required: true, unique: true
  },
  categoryId: {
    type: Number, required: true
  },
  categoryName: {
    type: String, required: true
  },
  videoTitle: {
    type: String, required: true
  },
  thumbnail:
  {
    type: String, required: true
  },
  channelName: {
    type: String
  },
   videoUrl: {
    type: String
  },
  
  createdAt: { type: Date, default: Date.now, expires: "30d" }  // Auto-delete after 30 days
});



const CategoryVideo = mongoose.model('CategoryVideo', categoryVideoSchema);
module.exports = CategoryVideo;
