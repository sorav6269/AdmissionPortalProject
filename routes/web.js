const express = require('express')
const FrontController = require('../controllers/FrontController')
const AdminController = require('../controllers/Admin/AdminController')
const checkauth = require('../middleware/checkauth')
const courseController = require('../controllers/courseController')
const route = express.Router()
const adminrole = require('../middleware/adminrole')
const islogin = require('../middleware/islogin')


// Routing
route.get('/home', checkauth,FrontController.home)
route.get('/about',checkauth, FrontController.about)
route.get('/',FrontController.login)
route.get('/Register', FrontController.Register)
route.get('/contact', checkauth, FrontController.contact)


// Insert Data
route.post('/userInsert',FrontController.userInsert)
route.post('/verifyLogin', FrontController.verifyLogin)
route.get("/profile", checkauth, FrontController.profile)
route.post("/changePassword", checkauth, FrontController.changePassword)
route.post("/updateProfile", checkauth, FrontController.updateProfile);
route.get('/logout',FrontController.logout)


// course
route.post('/courseInsert',checkauth,courseController.courseInsert)
route.get('/course/Display',checkauth,courseController.courseDisplay)
route.get('/course/View/:id',checkauth,courseController.courseView)
route.get('/course/Edit/:id',checkauth,courseController.courseEdit)
route.post('/course/Update/:id',courseController.courseUpdate)
route.get('/course/Delete/:id',courseController.courseDelete)

//Admin
route.get('/Admin/dashboard',checkauth, adminrole('admin'),  AdminController.dashboard)
route.get("/Admin/display", checkauth,adminrole('admin'), AdminController.display);
route.get("/Admin/adduser", checkauth, adminrole('admin'),AdminController.adduser);
route.get("/Admin/viewUser/:id", checkauth,adminrole('admin'),AdminController.viewUser);
route.get("/Admin/viewEdit/:id",checkauth,adminrole('admin'),AdminController.viewEdit);
route.post("/Admin/updateuser/:id",checkauth,adminrole('admin'),AdminController.updateuser);
route.get("/Admin/viewDelete/:id",checkauth,adminrole('admin'),AdminController.deleteuser);

// Admininsert
route.post("/Admin/userInsert", adminrole("admin"), AdminController.userInsert);

// Admin course
route.get("/Admin/Coursedisplay",checkauth,adminrole('admin'), AdminController.Coursedisplay);
route.get("/Admin/courseView/:id",checkauth,adminrole('admin'),AdminController.courseView);
route.get("/Admin/courseEdit/:id",checkauth,adminrole('admin'),AdminController.courseEdit);
route.post('/Admin/courseupdate/:id',checkauth,adminrole('admin'),AdminController.courseupdate)
route.get("/Admin/course/delete/:id", checkauth, adminrole('admin'),AdminController.coursedelete);
// status update
route.post("/Admin/statusUpdate/:id", checkauth, adminrole('admin'),AdminController.statusUpdate);


module.exports = route