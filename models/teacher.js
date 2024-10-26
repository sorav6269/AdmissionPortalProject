const mongoose = require('mongoose')
const teacherSchema = mongoose.Schema({
    name:{
        type:String,
        require:true,
    },

    Email:{
        type:String,
        require:true,
    },

    role:{
        type:String,
        default:'user'
    },
}, {timestamps: true})
const teacherModel = mongoose.model('teacher',teacherSchema)
module.exports = teacherModel