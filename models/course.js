const mongoose = require('mongoose')
const courseSchema  = new mongoose.Schema({
    name:{
        type:String,
        Required:true
    },
    email:{
        type:String,
        Required:true
    },
    phone:{
        type:String,
        Required:true
    },
    dob:{
        type:String,
        Required:true
    },
    address:{
        type:String,
        Required:true
    },
    gender:{
        type:String,
        Required:true
    },
    qualification:{
        type:String,
        Required:true
    },
    course:{
        type:String,
        Required:true
    },
    user_id:{
        type:String,
        Required:true
    },
    status:{
        type:String,
      default:"pending"
    },
    Comment:{
        type:String,
        default:"pending"
    },
},{timestamps:true})

const courseModel = mongoose.model('course',courseSchema)
module.exports= courseModel