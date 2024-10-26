const jwt = require('jsonwebtoken')
const authroles = (roles) => {
    return (req, res, next) => {
        //console.log(req.user.role)
        if (!roles.includes(req.userdata.role)) { // role db bala
            
            req.flash('error', "Unauthorised user please login")
            res.redirect("/")
        }
        next();
    }
}

module.exports = authroles