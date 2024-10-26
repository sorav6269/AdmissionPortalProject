const express = require('express')
const FrontController = require('../controllers/FrontController')
const AdminController = require('../controllers/Admin/AdminController')
const route = express.Router()


// Routing
route.get('/home', FrontController.home)
route.get('/about', FrontController.about)
route.get('/', FrontController.login)
route.get('/Register', FrontController.Register)
route.get('/contact', FrontController.contact)




//Admin
route.get('/Admin/dashboard', AdminController.dashboard)
route.get('/Admin/display', AdminController.display)
route.get('/Admin/adduser', AdminController.adduser)
route.get('/Admin/viewUser/:id',AdminController.viewUser)

// Insert Data
route.post('/userInsert', FrontController.userInsert)

module.exports = route