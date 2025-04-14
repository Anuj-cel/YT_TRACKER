const mongoose=require("mongoose")
const userUsageSchema=new mongoose.Schema({
    date:String,
    totalUsage:{type:Number,default:0},
    totalLimiter:Number,
    categoryLimits:{
        "Entertainment & Media":{type:Number,default:-1},
        "Sports & Gaming":{type:Number,default:-1},
        "News & Education":{type:Number,default:-1},
        "Tech & How-To":{type:Number,default:-1},
        "Music":{type:Number,default:-1}
    },   catergoryUsage:{
        "Entertainment & Media":{type:Number,default:0},
        "Sports & Gaming":{type:Number,default:0},
        "News & Education":{type:Number,default:0},
        "Tech & How-To":{type:Number,default:0},
        "Music":{type:Number,default:0}
    }
})

const UserUsage=mongoose.model("UserUsage",userUsageSchema);
module.exports=UserUsage;
