const mongoose = require('mongoose')
// const Local_Url = 'mongodb://127.0.0.1:27017/ADMISSIONPORTALPROJECT'
const Live_Url =
  "mongodb+srv://soravrathor:sorav12@cluster0.tkmjxwk.mongodb.net/ADMISSIONPORTALPROJECT?retryWrites=true&w=majority&appName=Cluster0";
const connectdb = ()=>{
    return mongoose.connect(Live_Url)
    .then(()=>{
        console.log('connect successs')
    }).catch((error)=>{
        console.log(error)
    })
}

module.exports = connectdb