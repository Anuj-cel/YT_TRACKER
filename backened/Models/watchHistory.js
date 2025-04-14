const mongoose=require("mongoose");
const watchHistorySchema = new mongoose.Schema({
    videoId: String,
    videoTitle: String,
    categoryId: Number,
    categoryName: String,
    watchTime: Number,
    channelTitle:String,
    Date: Date,
    isShorts:{
      type:Boolean,
      default:false
    },
    thumbnail:String,
    createdAt: { type: Date, default: Date.now}
  });

  const WatchHistory = mongoose.model("WatchHistory", watchHistorySchema);
  module.exports=WatchHistory;