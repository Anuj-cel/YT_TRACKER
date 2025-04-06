//yt_category_manager-->categoryvideos
//categorywatchtimes

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const CategoryVideo = require("./categorySchema");
const CategoryWatchTime = require("./categoryWatchTimeSchema")
const dbUrl = "mongodb://127.0.0.1:27017/yt_category_manager";
app.use(cors());
app.use(express.json());
let totalWatch = 0;
let totalShorts = 0;
const currentDate = new Date().toISOString().split('T')[0];
const YT_API_KEY = "AIzaSyBPKbh-ay-fnRxGtldTCvFOW5dkEIYVo2Y";
// const categoryMap = {
//   1: "Film & Animation",
//   2: "Autos & Vehicles",
//   10: "Music",
//   15: "Pets & Animals",
//   17: "Sports",
//   18: "Short Movies",
//   19: "Travel & Events",
//   20: "Gaming",
//   21: "Videoblogging",
//   22: "People & Blogs",
//   23: "Comedy",
//   24: "Entertainment",
//   25: "News & Politics",
//   26: "How-to & Style",
//   27: "Education",
//   28: "Science & Technology",
//   29: "Nonprofits & Activism",
//   30: "Movies",
//   31: "Anime/Animation",
//   32: "Action/Adventure",
//   33: "Classics",
//   34: "Comedy (Movies)",
//   35: "Documentary",
//   36: "Drama",
//   37: "Family",
//   38: "Foreign",
//   39: "Horror",
//   40: "Sci-Fi/Fantasy",
//   41: "Thriller",
//   42: "Shorts",
//   43: "Shows",
//   44: "Trailers"
// };
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
  25: "News & Education", 26: "News & Education", 27: "News & Education", 28: "News & Education", 29: "News & Education",
  28: "Tech & How-To"
};
const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

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

app.post('/watchtime', async (req, res) => {
  const { videoUrl, duration, isShorts } = req.body;
  const videoId = await getVideoId(videoUrl); // id of video
  if (!isShorts)
    totalWatch += duration;
  else totalShorts += duration;
  console.log(`Received Watch Time: ${duration} seconds (Shorts: ${isShorts})`);
  let categoryId = null;
  categoryId = await getCategoryID(videoId);
  const categoryName = await getCategoryName(categoryId);
  console.log("Category of the video is ", categoryName);
  updateWatchTime(currentDate, categoryName, duration);

  // Respond to the extension
  res.status(200).json({ message: 'Watch time received successfully!' });
});

app.get("/watchtime", async (req, res) => {
  let totalWatchTime = 0;
  let record = null;
  try {
    // Fetch the record for the specific date
    record = await CategoryWatchTime.findOne({ date: currentDate });

    // Check if a record exists for the specified date
    if (record == null) {
      console.log(`No record found for date: ${currentDate}`);
      return res.json({totalWatchTime, totalShorts,record });
    }

    // Display the record's date and categories with watch times
    console.log(`Record for Date: ${record.date.toDateString()}`);

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
  res.json({ totalWatchTime, totalShorts,record});
})

app.get("/watchTime/weekly",async(req,res)=>{
  const today=new Date();
  const currentDay=today.getDay();
  const diffOfDays=currentDay===0?6:currentDay-1;
   
  const monday=new Date(today);
  monday.setDate(today.getDate()-6)
  monday.setHours(0,0,0,0)
  today.setHours(23,59,59,999)
  const weeklyData = await CategoryWatchTime.find({
    date: {
      $gte: monday,
      $lte: today
    }
  });
  console.log("This is weekly data ",weeklyData)
  res.json(weeklyData)
})

app.get("/category", async (req, res) => {

  const videoId = getVideoId("https://www.youtube.com/shorts/-hzue8KIS9M");
  const category = await getCategoryID(videoId);
  res.json({ videoId, category });
});


// Function to retrieve categoryId from database
async function getCategoryID(videoId) {
  try {
    const categoryVideo = await CategoryVideo.findOne({ videoId });
    if (categoryVideo) {
      console.log("Api not called ");
      console.log("This is from getCategoryID ", categoryVideo)
      return categoryVideo.categoryId;
    } else {
      // If not present in database, retrieve from YouTube API
      console.log("This is videoId ",videoId)
      const categoryId = await getCategoryIdAPI(videoId);//using yt api
      if (categoryId) {
        await updateCategoryDb(categoryId, videoId, categoryMap[categoryId]);
      }
      return categoryId;
    }
  } catch (err) {
    console.error(err);
  }
}


async function updateWatchTime(date, category, watchTime) {
  try {
    // Find the record for the date
    const record = await CategoryWatchTime.findOne({ date: date });

    if (record) {
      // Check if the category exists in the existing record
      const existingCategory = record.categories.find(c => c.category === category);

      if (existingCategory) {
        // If the category exists, update the watch time
        existingCategory.watchTime += watchTime;
      } else {
        // If the category doesn't exist, add a new entry
        console.log("This is new record ",record);
        record.categories.push({ category, watchTime });
      }

      // Save the updated record
      await record.save();
    } else {
      // If the date doesn't exist, create a new record
      const newRecord = new CategoryWatchTime({
        date: date,
        categories: [{ category, watchTime }],
      });

      await newRecord.save();
    }
  } catch (error) {
    console.error('Error updating watch time:', error);
  }
}


const updateCategoryDb = async (categoryId, videoId, categoryName) => {
  try {
    const category = new CategoryVideo({ videoId, categoryId, categoryName });
    await category.save();
  } catch (err) {
    console.error("Error saving to DB:", err);
  }
};


async function getCategoryIdAPI(videoId) {
  console.log("Api called ");
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YT_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.items.length === 0) {
      throw new Error("Invalid Video ID or Video Not Found");
    }

    const categoryId = data.items[0].snippet.categoryId;
    return categoryId;  // Returns category ID (you can map this to actual category names)

  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

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
app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});

