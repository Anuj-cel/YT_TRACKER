const express=require("express")
const router=express.Router();

const CategoryWatchTime=require("../Models/DateWise")
const WatchHistory = require("../Models/watchHistory")
const HourWatch = require("../Models/Hourly")
const {getVideoId,getCategoryData,getCategoryName}=require("../utils/categoryFunctions.js")

module.exports=(io)=>{
  const {updateHourlyWatchTime,updateWatchHistory,updateWatchTime}=require("../utils/updateWatchTimeFunctions")(io)

router.post("/",async (req, res) => {
    try {
      let totalWatchTime = 0;
      let totalShorts = 0;
      const currentDate = new Date().toISOString().split("T")[0];
      const { videoUrl, duration, isShorts, realStartTime, realEndTime } = req.body;
  
      if (!realStartTime || !realEndTime || isNaN(realStartTime) || isNaN(realEndTime)) {
        console.error("⛔ Invalid timestamps received:", realStartTime, realEndTime);
        return res.status(400).json({ error: "Invalid timestamps received." });
      }
  
     
      const videoId = await getVideoId(videoUrl);
  
      if (!isShorts) totalWatchTime += duration;
      else totalShorts += duration;
  
      let videoData = await getCategoryData(videoId, isShorts);
     
      if(videoData._doc!=undefined)//as sometimes the videoData comes in ._doc form
     { videoData={...videoData._doc,duration,isShorts,currentDate};}
      else{
      videoData={...videoData,duration,isShorts,currentDate};
     }
      const { categoryId } = videoData;
      const categoryName = await getCategoryName(categoryId);
      const month = currentDate.slice(0, 7);
      
      await updateWatchHistory(videoData);
      await updateHourlyWatchTime(currentDate, realEndTime, duration);
      await updateWatchTime(currentDate, categoryName, duration, month, isShorts);
  
      const updatedRecord = await CategoryWatchTime.find({ date: currentDate });
      const hourlyData = await HourWatch.find({ date: currentDate });
      const monthlyData = await CategoryWatchTime.find({ month });
      const watchHistory = await WatchHistory.find({ Date: currentDate });
  
      updatedRecord.forEach(record => {
        if (record.categories) {
          record.categories.forEach(category => {
            totalWatchTime += category.watchTime;
            if (category.isShorts) {
              totalShorts += category.watchTime;
            }
          });
        }
      });
      io.emit("watchTimeDataUpdated", { totalWatchTime, totalShorts, records: updatedRecord });
      io.emit("watch-history", { totalWatchTime, totalShorts, records: watchHistory });
      io.emit("hourlyDataUpdated", hourlyData);
      io.emit("monthlyDataUpdates", monthlyData);
      res.status(200).json({ message: ' Watch time received successfully!' });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })

router.get("/",async (req, res) => {
    const currentDate = new Date().toISOString().split('T')[0];
    let totalWatchTime = 0;
    let totalShorts = 0;
    let records = null;
    try {
      // Fetch the records for the specific date
      records = await CategoryWatchTime.find({ date: currentDate });
      if (records.length === 0) {
        console.log(`No records found for date: ${currentDate}`);
        return res.json({ totalWatchTime, totalShorts, records });
      }
  
      // Calculate total watch time and shorts
      records.forEach(record => {
        if (record.categories) {
          record.categories.forEach(category => {
            totalWatchTime += category.watchTime;
            if (category.isShorts) {
              totalShorts += category.watchTime;
            }
          });
        }
      });
  
    } catch (err) {
      console.error('Error fetching records:', err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    res.json({ totalWatchTime, totalShorts, records });
  })

router.get("/hourly",async (req, res) => {
    const currentDate = new Date().toISOString().split('T')[0];
    const hourlyData = await HourWatch.find({ date: currentDate });
    res.json(hourlyData);
})

router.get("/weekly",async (req, res) => {
    const today = new Date();
    const currentDay = today.getDay();
    const diffOfDays = currentDay === 0 ? 6 : currentDay - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - diffOfDays)
    monday.setHours(0, 0, 0, 0)
    today.setHours(23, 59, 59, 999)
    const mondayString = monday.toISOString().split('T')[0];
    const todayString = today.toISOString().split('T')[0];
    const weeklyData = await CategoryWatchTime.find({
      date: {
        $gte: mondayString,
        $lte: todayString
      }
    });
    res.json(weeklyData)
})

router.get("/monthly",async (req, res) => {
    const currentDate = new Date().toISOString().split("T")[0];
    const currentMonth = currentDate.slice(0, 7);
    const monthlyData = await CategoryWatchTime.find({ month: currentMonth });
    res.json(monthlyData);
  })
return router;
}