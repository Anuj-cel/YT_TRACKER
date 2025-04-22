const express=require("express")
const router=express.Router();
const WatchHistory=require("../Models/watchHistory")

router.get("/",async (req, res) => {
    try {
      const currentDate = new Date().toISOString().split("T")[0];
      const watchHistory = await WatchHistory.find({ Date: currentDate });
      if (!watchHistory || watchHistory.length === 0) {
        return res.status(404).json({ message: "No watch history found" });
      }
  
      res.json(watchHistory);
    } catch (error) {
      console.error("Error fetching watch history:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  })

router.delete("/:videoId", async (req, res) => {
    try {
      const videoId = req.params.videoId;
      const currentDate = new Date().toISOString().split("T")[0];
      const result = await WatchHistory.deleteOne({ Date: currentDate, videoId: videoId });
  
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "No watch history found for the given videoId on the current date" });
      }
  
      res.json({ message: `Deleted watch history for videoId: ${videoId} on ${currentDate}` });
    } catch (error) {
      console.error("Error deleting watch history:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  })

  module.exports=router;