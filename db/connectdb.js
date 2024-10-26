const mongoose = require('mongoose')
const Local_Url = 'mongodb://127.0.0.1:27017/ADMISSIONPORTALPROJECT'
const connectdb = ()=>{
    return mongoose.connect(Local_Url)
    .then(()=>{
        console.log('connect successs')
    }).catch((error)=>{
        console.log(error)
    })
}

module.exports = connectdb