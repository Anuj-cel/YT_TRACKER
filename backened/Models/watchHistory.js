const mongoose=require("mongoose");
const watchHistorySchema = new mongoose.Schema({
  Date: Date,
    videoId: String,
    videoTitle: String,
    categoryId: Number,
    categoryName: String,
    thumbnail:String,
    channelTitle:String,
    watchTime: Number,
    isShorts:{
      type:Boolean,
      default:false
    },
    createdAt: { type: Date, default: Date.now}
  });

  const WatchHistory = mongoose.model("WatchHistory", watchHistorySchema);
  module.exports=WatchHistory;