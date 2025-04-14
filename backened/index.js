//yt_category_manager-->categoryvideos
//categorywatchtimes
const http = require("http")
const { Server } = require("socket.io")
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const CategoryVideo = require("./Models/categorySchema");
const CategoryWatchTime = require("./Models/DateWise")
const WatchHistory = require("./Models/watchHistory")
const HourWatch = require("./Models/Hourly")
const UserUsage = require("./Models/userUsage") //stores limit and data after limit
const dbUrl = "mongodb://127.0.0.1:27017/yt_category_manager";
const fakeWatchHistory = require("./fakeWatchHistory")
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});
app.use(cors());
app.use(express.json());
let totalWatch = 0;
let totalShorts = 0;
const YT_API_KEY = "AIzaSyBPKbh-ay-fnRxGtldTCvFOW5dkEIYVo2Y";
const categoryMap = {
  1: "Entertainment & Media", 23: "Entertainment & Media", 24: "Entertainment & Media",
  30: "Entertainment & Media", 31: "Entertainment & Media", 32: "Entertainment & Media",
  33: "Entertainment & Media", 34: "Entertainment & Media", 35: "Entertainment & Media",
  36: "Entertainment & Media", 37: "Entertainment & Media", 38: "Entertainment & Media",
  39: "Entertainment & Media", 40: "Entertainment & Media", 41: "Entertainment & Media",
  42: "Entertainment & Media", 43: "Entertainment & Media", 44: "Entertainment & Media",

  2: "Autos & Vehicles",
  10: "Music",
  17: "Sports & Gaming", 20: "Sports & Gaming",
  15: "Lifestyle & People", 19: "Lifestyle & People", 21: "Lifestyle & People", 22: "Lifestyle & People",
  25: "News & Education", 26: "News & Education", 27: "News & Education", 29: "News & Education",
  28: "Tech & How-To"
};
const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

async function main() {
  try {
    mongoose.connect(dbUrl)
    console.log("Db Connected!");
  }
  catch (err) {
    console.log(err);
  }
}
main();



//Categories
// Film & Animation: 1, 30-44
// Autos & Vehicles: 2
// Music: 10
// Pets & Animals: 15
// Sports: 17
// Short Movies: 18
// Travel & Events: 19
// Gaming: 20
// Vlogs: 21-22
// Entertainment: 23-24
// News & Education: 25-27
// Technology & Science: 28
// Nonprofits & Activism: 29


// Middleware







// POST endpoint to receive watch time data








// app.post('/watchtime', async (req, res) => {
//   const { videoUrl, duration, isShorts,realStartTime,realEndTime } = req.body;
//    // Convert to readable time for logs
//    const startTimeReadable = new Date(realStartTime).toLocaleString();
//    const endTimeReadable = new Date(realEndTime).toLocaleString();
//   const videoId = await getVideoId(videoUrl); // id of video
//   if (!isShorts)
//     totalWatch += duration;
//   else totalShorts += duration;
//   console.log(Received Watch Time: ${duration} seconds (Shorts: ${isShorts}) StartTime ${(startTimeReadable)} EndTime ${(endTimeReadable)});
//   let categoryId = null;
//   categoryId = await getCategoryID(videoId);
//   const categoryName = await getCategoryName(categoryId);
//   console.log("Category of the video is ", categoryName);
//   updateWatchTime(currentDate, categoryName, duration,startTimeReadable,endTimeReadable);

//   // Respond to the extension
//   res.status(200).json({ message: 'Watch time received successfully!' });
// });

io.on("connection", (socket) => {
  console.log("A new socket connected");
  // socket.on("updateLimits", async (data) => {
  //   const { totalLimit, categoryLimits } = data;

  //   console.log("Limits updated for", data);
  //   await UserUsage.deleteMany({});
  //   const newData = await new UserUsage(data);
  //   newData.date = new Date().toISOString().split("T")[0];
  //   await newData.save();
  //   console.log("This is limitter  ", newData)
  // });

  socket.on("disconnect", () => console.log("A user disconnected "));
})


app.post('/watchtime', async (req, res) => {
  try {
    const currentDate = new Date().toISOString().split("T")[0];
    const { videoUrl, duration, isShorts, realStartTime, realEndTime } = req.body;

    if (!realStartTime || !realEndTime || isNaN(realStartTime) || isNaN(realEndTime)) {
      console.error("⛔ Invalid timestamps received:", realStartTime, realEndTime);
      return res.status(400).json({ error: "Invalid timestamps received." });
    }

    const startTimeReadable = new Date(realStartTime).toLocaleString();
    const endTimeReadable = new Date(realEndTime).toLocaleString();

    const videoId = await getVideoId(videoUrl);

    if (!isShorts) totalWatch += duration;
    else totalShorts += duration;

    const videoData = await getCategoryData(videoId, isShorts);
    const { categoryId } = videoData;
    console.log("This is data3 from video ", videoData)
    const categoryName = await getCategoryName(categoryId);

    updateWatchHistory(videoData, duration, currentDate, isShorts);
    console.log(`✅ Watch Time: ${duration.toFixed(3)}s(Shorts: ${isShorts} | 📆 ${startTimeReadable} → ${endTimeReadable} | 🎬 ${categoryName}`);

    const month = currentDate.slice(0, 7);

    await updateHourlyWatchTime(currentDate, realEndTime, duration);
    await updateWatchTime(currentDate, categoryName, duration, month);

    const updatedRecord = await CategoryWatchTime.findOne({ date: currentDate });
    const hourlyData = await HourWatch.find({ date: currentDate });
    const monthlyData = await CategoryWatchTime.find({ month });


    const totalWatchTime = updatedRecord?.categories?.reduce((acc, c) => acc + c.watchTime, 0) || 0;

    io.emit("watchTimeDataUpdated", { totalWatchTime, totalShorts, record: updatedRecord });
    io.emit("hourlyDataUpdated", hourlyData);
    io.emit("monthlyDataUpdates", monthlyData);

    res.status(200).json({ message: '✅ Watch time received successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



app.get("/watchhistory", async (req, res) => {
  try {
    const currentDate=new Date().toISOString().split("T")[0];
    console.log("This is currentDate from watchHistory ",currentDate)
    const watchHistory = await WatchHistory.find({Date:currentDate});
    // console.log("This is watchHistory from index.js ", watchHistory)
    if (!watchHistory || watchHistory.length === 0) {
      return res.status(404).json({ message: "No watch history found" });
    }

    res.json(watchHistory);
  } catch (error) {
    console.error("Error fetching watch history:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/watchtime", async (req, res) => {
  const currentDate = new Date().toISOString().split('T')[0];
  let totalWatchTime = 0;
  let record = null;
  try {
    // Fetch the record for the specific date
    record = await CategoryWatchTime.findOne({ date: currentDate });

    // Check if a record exists for the specified date
    if (record == null) {
      console.log(`No record found for date: ${currentDate}`);
      io.emit("watchTimeDataUpdated", { totalWatchTime, totalShorts, record })
      return res.json({ totalWatchTime, totalShorts, record });
    }

    // Display the record's date and categories with watch times
    // console.log(`Record for Date: ${record.date}`);

    console.log(record.categories)
    record.categories.forEach(category => {
      console.log(category);
      totalWatchTime += category.watchTime;
    });

  } catch (err) {
    console.error('Error fetching record:', err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
  // console.log(record.categories);
  res.json({ totalWatchTime, totalShorts, record });

})

app.get("/watchTime/weekly", async (req, res) => {
  const currentDate = new Date().toISOString().split('T')[0];
  const today = new Date();
  const currentDay = today.getDay();
  const diffOfDays = currentDay === 0 ? 6 : currentDay - 1;

  const monday = new Date(today);
  monday.setDate(today.getDate() - diffOfDays)
  monday.setHours(0, 0, 0, 0)
  today.setHours(23, 59, 59, 999)

  // console.log("This is currentDay ", currentDay, " monday ", monday, " today ", today);

    const mondayString = monday.toISOString().split('T')[0];
    const todayString = today.toISOString().split('T')[0];

    const weeklyData = await CategoryWatchTime.find({
      date: {
        $gte: mondayString,
        $lte: todayString
      }
    });
  // console.log("This is weekly data ", weeklyData)
  res.json(weeklyData)


})

app.get("/watchtime/hourly", async (req, res) => {
  const currentDate = new Date().toISOString().split('T')[0];

  const hourlyData = await HourWatch.find({ date: currentDate });
  console.log("This is from index HourWatch ", hourlyData)
  res.json(hourlyData);

})
app.get("/watchtime/monthly", async (req, res) => {
  const currentDate = new Date().toISOString().split("T")[0];
  const currentMonth = currentDate.slice(0, 7);
  const monthlyData = await CategoryWatchTime.find({ month: currentMonth });
  console.log("This is monthly data in index.js ", monthlyData)
  res.json(monthlyData);
})

app.get("/category", async (req, res) => {
  const currentDate = new Date().toISOString().split('T')[0];
  const videoId = getVideoId("https://www.youtube.com/shorts/-hzue8KIS9M");
  const category = await getCategoryID(videoId);
  res.json({ videoId, category });

});


async function updateWatchTime(currentDate, categoryName, duration, month) {
  try {
    // Find existing document for the given month
    console.log("This is kamina currentDate ",currentDate);
    let watchTimeDoc = await CategoryWatchTime.findOne({ date:currentDate,month });

    console.log("This is existingCatagory ", watchTimeDoc)
    if (watchTimeDoc) {
      // Check if category already exists in the document
      const existingCategory = watchTimeDoc.categories.find(cat => cat.category === categoryName);

      if (existingCategory) {
        // If category exists, update the watch time
        existingCategory.watchTime += duration;
      } else {
        // If category doesn't exist, add a new category
        watchTimeDoc.categories.push({ category: categoryName, watchTime: duration });
      }

      // Update date if necessary
      watchTimeDoc.date = currentDate;

      await watchTimeDoc.save();
      console.log('Watch time updated successfully watchTimeDoc ', watchTimeDoc);
    } else {
      // If document doesn't exist, create a new one
      const newWatchTimeDoc = new CategoryWatchTime({
        date: currentDate,
        month,
        categories: [{ category: categoryName, watchTime: duration }]
      });
      await newWatchTimeDoc.save();
      console.log('Watch time updated successfully watchTimeDoc ', newWatchTimeDoc);
    }

    console.log('Watch time updated successfully');
  } catch (error) {
    console.error('Error updating watch time:', error);
  }
}


async function updateWatchHistory(...Data) {
  try {
    // Check if the video is already in the watch history
    const { videoId } = Data;
    const existingEntry = await WatchHistory.findOne({ videoId });


    if (existingEntry) {
      // Update the existing entry
      console.log("This is is existing Entry ", existingEntry)
      existingEntry.videoTitle = videoTitle;
      existingEntry.categoryId = categoryId;
      existingEntry.categoryName = categoryName;
      existingEntry.watchTime += watchTime;
      existingEntry.timeStamp = currentDate;
      existingEntry.thumbnail = thumbnail;
      await existingEntry.save();
      try {
        io.emit('watch-history', existingEntry);
      } catch (error) {
        console.error(error);
        io.emit('error', 'Error fetching watch history');
      }
    } else {
      // Create a new entry
      const newWatchHistory = new WatchHistory({
        videoId,
        videoTitle,
        categoryId,
        categoryName,
        watchTime,
        timeStamp: currentDate,
        thumbnail,
      });
      await newWatchHistory.save();
      try {
        console.log("This is new WatchHistory ", newWatchHistory)
        io.emit('watch-history', newWatchHistory);
      } catch (error) {
        console.error(error);
        io.emit('error', 'Error fetching watch history');
      }
    }

    // Emit the updated watch history

  } catch (err) {
    console.error('Error updating watch history:', err);
    throw err; // Re-throw the error
  }
}


// Function to retrieve categoryId from database
async function getCategoryByAPI(videoId) {
  console.log("API called for categoryId");
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YT_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      throw new Error("Invalid Video ID or Video Not Found");
    }

    const thumbnail = data.items[0].snippet.thumbnails.default.url;
    const videoTitle = data.items[0].snippet.title;
    const channelTitle = data.items[0].snippet.channelTitle;
    const categoryId = data.items[0].snippet.categoryId;
    const Data = { videoId, thumbnail, videoTitle, channelTitle, categoryId };
    console.log("This is data from videoApi ", Data);
    return Data;
  } catch (err) {
    console.error("Error fetching category ID from API:", err);
    return null;
  }
}

async function getCategoryData(videoId, isShorts) {
  try {
    const videoData = await CategoryVideo.findOne({ videoId });
    if (videoData) {
      console.log("Api not called ");
      console.log("This is from getCategoryID ", videoData)
      return videoData;
    } else {
      // If not present in database, retrieve from YouTube API
      const videoData = await getCategoryByAPI(videoId);//using yt api
      let videoUrl = "";
      if (isShorts) {
        videoUrl = `https://www.youtube.com/shorts/${videoData.vidoeoId}`
      } else {
        videoUrl = `https://www.youtube.com/watch?v=${videoData.videoId}`;
      }
      console.log("This is videoIdData2 ", videoUrl, videoData)

      if (videoData.categoryId) {
        videoData.categoryName = categoryMap[videoData.categoryId];
        await updateCategoryDb(videoData, videoUrl, isShorts);
      }
      return videoData;
    }
  } catch (err) {
    console.error(err);
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

    console.log(`⏱ Updating hour ${hour}: +${(durationForHour / 60).toFixed(2)} min`);

    await HourWatch.findOneAndUpdate(
      { date: currentDate, hour },
      { $inc: { duration: durationForHour } },
      { upsert: true, new: true }
    );

    if (remainingDuration === 0) break;
  }
}





async function updateWatchHistory(videoData, duration, currentDate, isShorts) {
  try {
    // Check if the video is already in the watch history
    const { videoId } = videoData;
    const existingEntry = await WatchHistory.findOne({ videoId });


    if (existingEntry) {
      // Update the existing entry
      console.log("This is is existing Entry ", existingEntry)
      existingEntry.watchTime += duration;
      await existingEntry.save();
      try {
        io.emit('watch-history', existingEntry);
      } catch (error) {
        console.error(error);
        io.emit('error', 'Error fetching watch history');
      }
    } else {
      // Create a new entry
      console.log("This is videoData", videoData)
      const newWatchHistory = new WatchHistory({
        ...videoData, Date: currentDate, watchTime: duration, isShorts
      });
      await newWatchHistory.save();
      try {
        console.log("This is new WatchHistory ", newWatchHistory)
        io.emit('watch-history', newWatchHistory);
      } catch (error) {
        console.error(error);
        io.emit('error', 'Error fetching watch history');
      }
    }

    // Emit the updated watch history

  } catch (err) {
    console.error('Error updating watch history:', err);
    throw err; // Re-throw the error
  }
}

const updateCategoryDb = async (Data, videoUrl, isShorts) => {
  try {
    const category = new CategoryVideo({ ...Data, videoUrl, isShorts });
    console.log("This is new Url ", category);
    await category.save();
  } catch (err) {
    console.error("Error saving to DB:", err);
  }
};


function getVideoId(url) {
  if (url.includes("youtube.com/shorts/")) {
    const urlParts = url.split("/");
    const videoId = urlParts[urlParts.length - 1];
    return videoId;
  } else {
    const urlObject = new URL(url);
    const videoId = urlObject.searchParams.get('v');
    return videoId;
  }
}

async function getCategoryName(categoryId) {
  return categoryMap[categoryId] || "Others";
}



// Start the backend server
server.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});



async function isLimitExceeded(currentDate, category, additionalTime) {
  const limitRecord = await UserUsage.findOne({ date: currentDate });
  if (!limitRecord) return false; // No limits set

  const limits = limitRecord.categoryLimits || {};
  const usage = limitRecord.catergoryUsage || {};

  const currentLimit = limits[category];
  const currentUsage = usage[category] || 0;

  // If limit is -1 (unlimited), allow it
  if (currentLimit === -1 || currentLimit === undefined) {
    return false;
  }

  // Check if new usage exceeds limit
  return (currentUsage + additionalTime) > currentLimit;
}

async function isLimitExceededTotalTime(currentDate, additionalTime) {
  const limitRecord = await UserUsage.findOne({ date: currentDate });
  if (!limitRecord) return false; // No limits set


  // If limit is -1 (unlimited), allow it

  if (limitRecord.totalLimiter != -1) {
    console.log("There is not categoryLimit here ");

    return limitRecord.totalLimiter < limitRecord.totalUsage;
  }
  return false;
}
// app.post("/clear-limits", async (req, res) => {
//   const currentDate = new Date().toISOString().split('T')[0];
//   try {
//     const usage = await UserUsage.findOne({ date: currentDate });
//     if (!usage) return res.status(404).json({ message: "No usage found" });

//     usage.totalLimiter = -1;
//     for (let key in usage.categoryLimits) {
//       usage.categoryLimits[key] = -1;
//     }
//     await usage.save();

//     return res.json({ message: "Limits removed" });
//   } catch (err) {
//     return res.status(500).json({ message: "Error clearing limits" });
//   }
// });