const YT_API_KEY=process.env.YT_API_KEY;

const CategoryVideo = require("../Models/categorySchema");

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

async function getVideoId(url) {
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
  
async function getCategoryByAPI(videoId) {
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
  
async function getCategoryName(categoryId) {
    return categoryMap[categoryId] || "Others";
  }

  const updateCategoryDb = async (Data, videoUrl, isShorts) => {
    try {
      const category = new CategoryVideo({ ...Data, videoUrl, isShorts });
      await category.save();
    } catch (err) {
      console.error("Error saving to DB:", err);
    }
  };

module.exports = {
    getVideoId,
    getCategoryByAPI,
    getCategoryData,
    getCategoryName,
  };