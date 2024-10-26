const courseModel = require('../models/course')
const nodemailer = require('nodemailer')
class courseController {
static courseInsert=async(req,res)=>{
    try {
        const {id} = req.userdata
        const{name,email,phone,dob,address,gender,qualification,course}= req.body
        const result = new courseModel({
          name: name,
          email: email,
          phone: phone,
          dob: dob,
          address:address,
          gender: gender,
          qualification: qualification,
          course: course,
          user_id: id,
        });
        await result.save()
        this.sendEmail(name,email,course)
        res.redirect('/course/Display')
    } catch (error) {
        console.log(error)
    }
}
static courseDisplay=async(req,res)=>{
    try {
        const { id, name, image } = req.userdata
        const data = await courseModel.find({user_id: id})
        // console.log(data)
        res.render("course/Display", {d:data,n:name,i:image })
    } catch (error) {
        console.log(error)
    }
}
static courseView =async(req,res)=>{
    try {
        const {name,email,image} = req.userdata
        const id = req.params.id
        const data = await courseModel.findById(id)
        // console.log(data)
        res.render("course/View",{d:data,e:email,i:image,n:name})
    } catch (error) {
        console.log(error)
    }
}

static courseEdit=async(req,res)=>{
    try {
      
        const id = req.params.id
        const {name,email,image} = req.userdata
        // console.log(id)
        const data = await courseModel.findById(id)
        // console.log(data)
        res.render('course/Edit',{d:data,n:name,i:image})
    } catch (error) {
     console.log(error)   
    }
}
static courseUpdate=async(req,res)=>{
    try {
    const id = req.params.id;
    const { name, email, phone, dob, address, gender, qualification, course } = req.body; // Correct destructuring

    // Update course data by ID
    const data = await courseModel.findByIdAndUpdate(id, {
      name,
      email,
      phone,
      dob,
      address,
      gender,
      qualification,
      course,
    });

    res.redirect("/course/Display");
  } catch (error) {
    console.log(error);
  }
};

static courseDelete=async(req,res)=>{
    try {
        const id = req.params.id
        const data  = await courseModel.findByIdAndDelete(id)
        res.redirect("/course/Display");
    } catch (error) {
        console.log(error)
    }
    }
    
    static sendEmail = async (name, email, course) => {
        let transporter = await nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          auth: {
            user: "soravrathor786@gmail.com",
            pass: "ujxfdqoozbsjmlqr",
          },
        });

        let info = await transporter.sendMail({
            from: "test@gmail.com",   // send address
            to: email, // list of receivers
            subject: `course ${course}`, // subject line
            text: "hello", // plan text body
            html: `<b>${name}</b> course <b>${course}</b> insert successfull! <br>`, //html body
        })
    }
}

module.exports = courseController