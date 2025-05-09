const CategoryWatchTime = require("../Models/DateWise")
const WatchHistory = require("../Models/watchHistory")
const HourWatch = require("../Models/Hourly")

module.exports=(io)=>{
async function updateWatchTime(currentDate, categoryName, duration, month, isShorts) {
    try {
      let watchTimeDoc = await CategoryWatchTime.findOne({ date: currentDate, month, isShorts });
   if (watchTimeDoc) {
        const existingCategory = watchTimeDoc.categories.find(
          cat => cat.category === categoryName
        );
  
        if (existingCategory) {
          existingCategory.watchTime += duration;
        } else {
          watchTimeDoc.categories.push({
            category: categoryName,
            watchTime: duration,
            isShorts: isShorts
          });
   
        }
  
        // Save updated document
        await watchTimeDoc.save();
        // io.emit('watchTimeDataUpdated', watchTimeDoc);
        console.log(" Document saved in watchHistory :", watchTimeDoc);
  
      } else {
        const newWatchTimeDoc = new CategoryWatchTime({
          date: currentDate,
          month: month,
          isShorts: isShorts,
          categories: [{
            category: categoryName,
            watchTime: duration,
            isShorts: isShorts
          }]
        });
  
        await newWatchTimeDoc.save();
        // io.emit('watchTimeDataUpdated', newWatchTimeDoc);
      }
  
    } catch (error) {
      console.error(" Error updating watch time:", error);
    }
  }
  
  async function updateWatchHistory(videoData) {
    console.log("WatchHistory called is videoData",videoData);
  const {
    videoId,
    categoryId,
    categoryName,
    videoTitle,
    thumbnail,
    channelTitle,
    duration,
    isShorts,
    currentDate,
  } = videoData;
    try {
  
      const existingEntry = await WatchHistory.findOne({ videoId });
      if (existingEntry && videoId!=undefined) {
        // Update the existing entry
        existingEntry.videoTitle = videoTitle;
        existingEntry.videoId = videoId;
        existingEntry.categoryId = categoryId;
        existingEntry.categoryName = categoryName;
        existingEntry.watchTime += duration;
        existingEntry.Date = currentDate;
        existingEntry.thumbnail = thumbnail;
        existingEntry.isShorts=isShorts
        
        await existingEntry.save();
        io.emit('watch-history', existingEntry);
      } else {
        // Create a new entry
        const newWatchHistory = new WatchHistory({
          videoId,
          videoTitle,
          categoryId,
          categoryName,
          channelTitle,
          watchTime:duration,
          Date: currentDate,
          isShorts,
          thumbnail,
        });
  
        await newWatchHistory.save();
      
        io.emit('watch-history', newWatchHistory);
      }
    } catch (err) {
      console.error('Error updating watch history:', err);
      io.emit('error', 'Error updating watch history');
      throw err;
    }
  }
  
  async function updateHourlyWatchTime(currentDate, realEndTime, totalDuration) {
    const end = new Date(realEndTime);
    const endHour = end.getHours();
    const durationInHours = totalDuration / 3600; // convert seconds to hours
    const hoursToDistribute = Math.ceil(durationInHours);
    let remainingDuration = totalDuration; // in seconds
  
    for (let i = 0; i < hoursToDistribute; i++) {
      const hour = endHour - i;
      let durationForHour;
  
      if (remainingDuration >= 3600) {
        durationForHour = 3600; // 1 hour in seconds
        remainingDuration -= 3600;
      } else {
        durationForHour = remainingDuration;
        remainingDuration = 0;
      }
  
  
      await HourWatch.findOneAndUpdate(
        { date: currentDate, hour },
        { $inc: { duration: durationForHour } },
        { upsert: true, new: true }
      );
  
      if (remainingDuration === 0) break;
    }
  }

   return { updateHourlyWatchTime,updateWatchHistory,updateWatchTime}
}  