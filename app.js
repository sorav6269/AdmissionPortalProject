const express = require('express')
const app = express()
const Port = 3000
const web = require('./routes/web')
const connectdb = require('./db/connectdb')
const fileUpload = require("express-fileupload")
const cookieparser  = require('cookie-parser')
app.use(cookieparser())

const sesssion  = require('express-session')
const flash = require('connect-flash')

// html css set
app.set('view engine','ejs')

// html css
app.use(express.static('public'))

// fileupload image
app.use(fileUpload({
    limits:{fieldSize: 50* 1024* 1024},
    useTempFiles: true}));

// connect flash and session
    app.use(sesssion({
        secret:'secret',
        cookie:{maxAge:6000},
        resave:false,
        saveUninitialized:false,
    }));
// Flash messages
app.use(flash())

// connect db
connectdb()
app.use(express.urlencoded({extended:true}))

// Routing
app.use('/',web)



// Server Create
app.listen(Port,()=>{
    console.log(`Server Started Localhost: ${Port}`)
})