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
    let totalWatchTime = 0;
    let totalShorts = 0;
    const currentDate = new Date().toISOString().split("T")[0];
    const { videoUrl, duration, isShorts, realStartTime, realEndTime } = req.body;

    if (!realStartTime || !realEndTime || isNaN(realStartTime) || isNaN(realEndTime)) {
      console.error("⛔ Invalid timestamps received:", realStartTime, realEndTime);
      return res.status(400).json({ error: "Invalid timestamps received." });
    }

    const startTimeReadable = new Date(realStartTime).toLocaleString();
    const endTimeReadable = new Date(realEndTime).toLocaleString();

    const videoId = await getVideoId(videoUrl);

    if (!isShorts) totalWatchTime += duration;
    else totalShorts += duration;

    let videoData = await getCategoryData(videoId, isShorts);
 
    videoData={...videoData._doc,duration,isShorts,currentDate};
    const { categoryId } = videoData;
    const categoryName = await getCategoryName(categoryId);
   
    console.log("This is data3 from video ", videoData)
   await updateWatchHistory(videoData);


    console.log(`✅ Watch Time: ${duration.toFixed(3)}s(Shorts: ${isShorts} | 📆 ${startTimeReadable} → ${endTimeReadable} | 🎬 ${categoryName}`);

    const month = currentDate.slice(0, 7);

    await updateHourlyWatchTime(currentDate, realEndTime, duration);
    await updateWatchTime(currentDate, categoryName, duration, month, isShorts);

    const updatedRecord = await CategoryWatchTime.find({ date: currentDate });
    const hourlyData = await HourWatch.find({ date: currentDate });
    const monthlyData = await CategoryWatchTime.find({ month });

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
    const watchHistory = await WatchHistory.find({ Date: currentDate });
    console.log("This is just before the socket io and it is watchHistory ",watchHistory)
    console.log("This is just before the socket io ",updatedRecord,totalWatchTime,totalShorts)
    io.emit("watchTimeDataUpdated", { totalWatchTime, totalShorts, records: watchHistory });
    io.emit("hourlyDataUpdated", hourlyData);
    io.emit("monthlyDataUpdates", monthlyData);

    res.status(200).json({ message: '✅ Watch time received successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/watchhistory/:videoId", async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const currentDate = new Date().toISOString().split("T")[0];

    console.log("Deleting watch history for videoId:", videoId, "on date:", currentDate);

    const result = await WatchHistory.deleteOne({ Date: currentDate, videoId: videoId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No watch history found for the given videoId on the current date" });
    }

    res.json({ message: `Deleted watch history for videoId: ${videoId} on ${currentDate}` });
  } catch (error) {
    console.error("Error deleting watch history:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.get("/watchhistory", async (req, res) => {
  try {
    const currentDate = new Date().toISOString().split("T")[0];
    console.log("This is currentDate from watchHistory ", currentDate)
    const watchHistory = await WatchHistory.find({ Date: currentDate });
    console.log("This is watchHistory from index.js ", watchHistory)
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
  let totalShorts = 0;
  let records = null;
  try {
    // Fetch the records for the specific date
    records = await CategoryWatchTime.find({ date: currentDate });

    // console.log("This is record from /watchtime ",records)

    // Check if any records exist for the specified date
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
  io.emit("watchTimeDataUpdated", { totalWatchTime, totalShorts, records })
  res.json({ totalWatchTime, totalShorts, records });
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
  // console.log("This is from index HourWatch ", hourlyData)
  res.json(hourlyData);

})
app.get("/watchtime/monthly", async (req, res) => {
  const currentDate = new Date().toISOString().split("T")[0];
  const currentMonth = currentDate.slice(0, 7);
  const monthlyData = await CategoryWatchTime.find({ month: currentMonth });
  // console.log("This is monthly data in index.js ", monthlyData)
  res.json(monthlyData);
})

app.get("/category", async (req, res) => {
  const currentDate = new Date().toISOString().split('T')[0];
  const videoId = getVideoId("https://www.youtube.com/shorts/-hzue8KIS9M");
  const category = await getCategoryID(videoId);
  res.json({ videoId, category });

});



async function updateWatchTime(currentDate, categoryName, duration, month, isShorts) {
  try {
    // Log incoming data
    console.log("🕒 Updating watch time for:");
    console.log("   ➤ Date:", currentDate);
    console.log("   ➤ Month:", month);
    console.log("   ➤ Category:", categoryName);
    console.log("   ➤ Duration:", duration);
    console.log("   ➤ isShorts:", isShorts);

    // Find existing document for the given date, month, and isShorts
    let watchTimeDoc = await CategoryWatchTime.findOne({ date: currentDate, month, isShorts });

    console.log("📄 Existing document found:", watchTimeDoc);

    if (watchTimeDoc) {
      // Check if the category already exists
      const existingCategory = watchTimeDoc.categories.find(
        cat => cat.category === categoryName
      );

      if (existingCategory) {
        // If category exists, update the watch time
        existingCategory.watchTime += duration;
        console.log(`✅ Updated watchTime for category '${categoryName}' by ${duration}`);
      } else {
        // If category doesn't exist, add a new category
        watchTimeDoc.categories.push({
          category: categoryName,
          watchTime: duration,
          isShorts: isShorts
        });
        console.log(`➕ Added new category '${categoryName}' with watchTime ${duration}`);
      }

      // Save updated document
      await watchTimeDoc.save();
      console.log("💾 Document saved in watchHistory :", watchTimeDoc);

    } else {
      // Create new document if not found
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
      console.log("🆕 Created new document: from watchHistory ", newWatchTimeDoc);
    }

    console.log("✅ Watch time update complete.");
  } catch (error) {
    console.error("❌ Error updating watch time:", error);
  }
}



// async function updateWatchHistory(...Data) {
//   try {
//     // Check if the video is already in the watch history
//     const { videoId } = Data;
//     const existingEntry = await WatchHistory.findOne({ videoId });
//     console.log("This is is existing Data ", Data)

//     if (existingEntry) {
//       // Update the existing entry
//       console.log("This is is existing Entry ", existingEntry)
//       existingEntry.videoTitle = Data.videoTitle;
//       existingEntry.categoryId = categoryId;
//       existingEntry.categoryName = categoryName;
//       existingEntry.watchTime += watchTime;
//       existingEntry.timeStamp = currentDate;
//       existingEntry.thumbnail = thumbnail;
//       await existingEntry.save();
//       try {
//         io.emit('watch-history', existingEntry);
//       } catch (error) {
//         console.error(error);
//         io.emit('error', 'Error fetching watch history');
//       }
//     } else {
//       // Create a new entry
//       const newWatchHistory = new WatchHistory({
//         videoId,
//         videoTitle,
//         categoryId,
//         categoryName,
//         watchTime,
//         timeStamp: currentDate,
//         thumbnail,
//       });
//       await newWatchHistory.save();
//       try {
//         console.log("This is new WatchHistory ", newWatchHistory)
//         io.emit('watch-history', newWatchHistory);
//       } catch (error) {
//         console.error(error);
//         io.emit('error', 'Error fetching watch history');
//       }
//     }

//     // Emit the updated watch history

//   } catch (err) {
//     console.error('Error updating watch history:', err);
//     throw err; // Re-throw the error
//   }
// }


// Function to retrieve categoryId from database

async function updateWatchHistory(videoData) {
  console.log("This  from updateWatchHistory function ")
  console.log("This is videoData from updateWatchHistory function ",videoData);

const {
  videoId,
  categoryId,
  categoryName,
  videoTitle,
  thumbnail,
  videoUrl,
  createdAt,
  channelTitle,
  duration,
  isShorts,
  currentDate,
} = videoData;

console.log( videoId, categoryId, categoryName, videoTitle, thumbnail, videoUrl, createdAt, duration, isShorts, currentDate);
  try {
    const existingEntry = await WatchHistory.findOne({ videoId });
    console.log("This is existing Data4",existingEntry);

    if (existingEntry) {
      // Update the existing entry
      console.log("This is existing Entry4", existingEntry);
      existingEntry.videoTitle = videoTitle;
      existingEntry.categoryId = categoryId;
      existingEntry.categoryName = categoryName;
      existingEntry.watchTime += duration;
      existingEntry.Date = currentDate;
      existingEntry.thumbnail = thumbnail;

      await existingEntry.save();
      console.log("Existing Entry sent ");
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
      console.log("This is new WatchHistory", newWatchHistory);
      io.emit('watch-history', newWatchHistory);
    }
  } catch (err) {
    console.error('Error updating watch history:', err);
    io.emit('error', 'Error updating watch history');
    throw err;
  }
}


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





// async function updateWatchHistory(videoData, duration, currentDate, isShorts) {
//   try {
//     // Check if the video is already in the watch history
//     const { videoId } = videoData;
//     const existingEntry = await WatchHistory.findOne({ videoId });


//     if (existingEntry) {
//       // Update the existing entry
//       console.log("This is is existing Entry ", existingEntry)
//       existingEntry.watchTime += duration;
//       await existingEntry.save();
//       try {
//         io.emit('watch-history', existingEntry);
//       } catch (error) {
//         console.error(error);
//         io.emit('error', 'Error fetching watch history');
//       }
//     } else {
//       // Create a new entry
//       console.log("This is videoData", videoData)
//       const newWatchHistory = new WatchHistory({
//         ...videoData, Date: currentDate, watchTime: duration, isShorts
//       });
//       await newWatchHistory.save();
//       try {
//         console.log("This is new WatchHistory ", newWatchHistory)
//         io.emit('watch-history', newWatchHistory);
//       } catch (error) {
//         console.error(error);
//         io.emit('error', 'Error fetching watch history');
//       }
//     }

//     // Emit the updated watch history

//   } catch (err) {
//     console.error('Error updating watch history:', err);
//     throw err; // Re-throw the error
//   }
// }

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