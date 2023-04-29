const mongoose=require("mongoose")

const schema=({
name:String,
phone:Number
})

module.exports=mongoose.model("users",schema)
