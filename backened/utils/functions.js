module.exports=function getVideoId(url) {
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
 module.exports= async function getCategoryIdAPI(videoId) {
    console.log("API called for categoryId");
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YT_API_KEY}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (!data.items || data.items.length === 0) {
        throw new Error("Invalid Video ID or Video Not Found");
      }
      const thumbnailUrl = data.items[0].snippet.thumbnails.default.url;
      const thumbnailTitle = data.items[0].snippet.title;
      const channelTitle = data.items[0].snippet.channelTitle;
      const categoryId = data.items[0].snippet.categoryId;
      return parseInt(categoryId);
    } catch (err) {
      console.error("Error fetching category ID from API:", err);
      return null;
    }
  }
module.exports=async function getCategoryID(videoId) {
  try {
    const categoryVideo = await CategoryVideo.findOne({ videoId });
    if (categoryVideo) {
      console.log("Api not called ");
      console.log("This is from getCategoryID ", categoryVideo)
      return categoryVideo.categoryId;
    } else {
      // If not present in database, retrieve from YouTube API
      console.log("This is videoId ", videoId)
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

module.exports=async function updateHourlyWatchTime(currentDate, realStartTime, realEndTime, totalDuration) {
  const start = new Date(realStartTime);
  const end = new Date(realEndTime);

  const durationSeconds = (end - start) / 1000 || 1; // Ensure duration is at least 1 second
  const durationPerSecond = totalDuration / durationSeconds;

  let current = new Date(start);

  while (current <= end) {
    const hour = current.getHours(); // 0 to 23

    // Increment duration for this hour
    await HourWatch.findOneAndUpdate(
      { date: currentDate, hour },
      { $inc: { duration: durationPerSecond } },
      { upsert: true, new: true }
    );

    // Move to next second
    current.setSeconds(current.getSeconds() + 1);
  }
}

module.exports=async function getCategoryName(categoryId) {
    return categoryMap[categoryId] || "Others";
  }
  module.exports= async function updateCategoryDb(categoryId, videoId, categoryName) {
    try {
      const category = new CategoryVideo({ videoId, categoryId, categoryName });
      await category.save();
    } catch (err) {
      console.error("Error saving to DB:", err);
    }
  };