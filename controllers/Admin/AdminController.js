const usermodel = require("../../models/user");
const courseModel = require("../../models/course");
const cloudinary = require('cloudinary')
const nodemailer = require('nodemailer')
class AdminController {
  static dashboard = async (req, res) => {
    try {
       const stu = await usermodel.countDocuments({});
       const course = await courseModel.countDocuments({});
      const { name, image } = req.userdata;
      res.render("Admin/dashboard", { n: name, i: image, s:stu, c:course });
    } catch (error) {
      console.log(error);
    }
  };

  static display = async (req, res) => {
    try {
      const { name, image } = req.userdata;
      const data = await usermodel.find({ role: "user" });
      // console.log(data)
      res.render("Admin/display", { d: data, n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };
  static adduser = async (req, res) => {
    try {
      const { name, image } = req.userdata;
      res.render("Admin/adduser", { n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };

  static viewUser = async (req, res) => {
    try {
      const { name, image } = req.userdata;
      const id = req.params.id;
      // console.log(id)
      const data = await usermodel.findById(id);
      // console.log(data)
      res.render("Admin/ViewUser", { d: data, n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };

  static viewEdit = async (req, res) => {
    try {
      const { name, image } = req.userdata;
      const id = req.params.id;
      // console.log(id)
      const data = await usermodel.findById(id);
      // console.log(data)
      res.render("Admin/viewEdit", { d: data, n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };

  static updateuser = async (req, res) => {
    try {
      const id = req.params.id;
      const { n, e, p } = req.body;
      // console.log(id)
      const data = await usermodel.findByIdAndUpdate(id, {
        name: n,
        email: e,
        password: p,
      });
      // console.log(data)
      res.redirect("/Admin/display");
    } catch (error) {
      console.log(error);
    }
  };

  static deleteuser = async (req, res) => {
    try {
      const id = req.params.id;
      // console.log(id)
      await usermodel.findByIdAndDelete(id);
      res.redirect("/Admin/display");
    } catch (error) {
      console.log(error);
    }
  };

  static userInsert = async (req, res) => {
    try {
      // console.log(req.files)
      const file = req.files.image;
      const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "profiles",
      });
      // console.log(imageUpload);
      //  console.log(file)
      const { n, e, p, cp,image } = req.body;
      const result = new usermodel({
        name: n,
        email: e,
        password: p,
        confirmpassword: cp,
        image: {
          public_id: imageUpload.public_id,
          url: imageUpload.secure_url,
        },
      });
      await result.save();
      res.redirect("/"); // route ka url
    } catch (error) {
      console.log(error);
    }
  };

  // course method

  static Coursedisplay = async (req, res) => {
    try {
      const { name, image } = req.userdata;
      const data = await courseModel.find();
      // console.log(data)
      res.render("Admin/Course/display", { d: data, n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };

  static courseView = async (req, res) => {
    try {
      const { name, image } = req.userdata;
      const id = req.params.id;
      // console.log(id)
      const data = await courseModel.findById(id);
      // console.log(data)
      res.render("Admin/course/View", { d: data, n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };

  static courseEdit = async (req, res) => {
    try {
      const { name, image } = req.userdata;
      const id = req.params.id;
      // console.log(id)
      const data = await courseModel.findById(id);
      // console.log(data)
      res.render("Admin/course/Edit", { d: data, n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };

  static courseupdate = async (req, res) => {
    try {
      const id = req.params.id;
      const {
        name,
        email,
        phone,
        dob,
        address,
        gender,
        qualification,
        course,
      } = req.body; // Correct destructuring

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

  static coursedelete = async (req, res) => {
    try {
      const id = req.params.id;
      const data = await courseModel.findByIdAndDelete(id);
      res.redirect("/course/Display");
    } catch (error) {
      console.log(error);
    }
  };

  static statusUpdate = async (req, res) => {
    try {
      const { name, email, status, Comment } = req.body;
      const id = req.params.id;
      await courseModel.findByIdAndUpdate(id, {
        status: status,
        Comment: Comment,
      });
      this.sendEmail( name, email, status, Comment)
      res.redirect("/Admin/Coursedisplay");
    } catch (error) {
      console.log(error);
    }
  };

  static sendEmail = async (name, email, status, Comment) => {
    let transporter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: "soravrathor786@gmail.com",
        pass: "ujxfdqoozbsjmlqr",
      },
    });

    let info = await transporter.sendMail({
      from: "test@gmail.com", // send address
      to: email, // list of receivers
      subject: `status ${status}`, // subject line
      text: "hello", // plan text body
      html: `<b>${name}</b> status <b>${status}</b>  successfull! <br>
      <b> Comment from Admin</b> ${Comment}`, //html body
    });
  };
}

module.exports = AdminController;
