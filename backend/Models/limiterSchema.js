const mongoose=require("mongoose");

const limiterSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
      },
      categories: [{
        category: {
          type: String,
          required: true,
        },
        watchTime: {
          type: Number,
          required: true,
        },
      }],
  });

  const Limiter=mongoose.model("limiter",limiterSchema);
  module.exports=Limiter;