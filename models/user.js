const { request } = require('express')
const mongoose = require('mongoose')
const userSchema= mongoose.Schema({
    name:{
        type:String,
        require:true,
    },

    password:{
        type:String,
        require:true,
    },
    confirmpassword:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
    },

    image:{
        public_id:{
            type: String,
            request: true
        },
        url:{
            type: String,
            request: true
        },
    },

    role:{
        type:String,
        default:'user',
    },
}, {timestamps:true})

const userModel = mongoose.model('user',userSchema)
module.exports = userModel