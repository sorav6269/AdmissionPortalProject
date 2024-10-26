const jwt = require('jsonwebtoken')
const userModel = require('../models/user')
const {verifyLogin} = require('../controllers/FrontController')
const checkauth = async (req,res,next)=>{
    // console.log('chacking auth')
    const{token} = req.cookies
    // console.log(token)
    if(!token){
        req.flash('error',"Unauthorised user please login")
        res.redirect('/')
    }else{
        const verifyToken = jwt.verify(token,'xkdfjd4dkfgd')
        const data = await userModel.findOne({_id:verifyToken.ID})
        // console.log(data)
        req.userdata = data
        // console.log(verifyToken)
        next();
    }
}

module.exports = checkauth