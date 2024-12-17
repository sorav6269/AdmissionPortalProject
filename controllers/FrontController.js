const usermodel = require("../models/user");
const cloudinary = require("cloudinary");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const courseModel = require("../models/course");
const randomstring = require('randomstring')
const nodemailer = require('nodemailer')

cloudinary.config({
  cloud_name: "dwovzxxol",
  api_key: "227631891845838",
  api_secret: "fF1pNSbC9dBhtUDQr5XEbkErkww", // Click 'View API Keys' above to copy your API secret
});
class FrontController {
  static home = async (req, res) => {
    try {
      const { name, image, email, id, role } = req.userdata;
      const btech = await courseModel.findOne({ user_id: id, course: "btech" });
      const bca = await courseModel.findOne({ user_id: id, course: "bca" });
      const mca = await courseModel.findOne({ user_id: id, course: "mca" });
      res.render("home", {
        n: name,
        i: image,
        e: email,
        btech: btech,
        bca: bca,
        mca: mca,
        r: role,
      });
    } catch (error) {
      console.log(error);
    }
  };

  static about = async (req, res) => {
    try {
      const { name, image } = req.userdata;
      res.render("about", { n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };

  static login = async (req, res) => {
    try {
      // res.render('login')
      res.render("login", {
        message: req.flash("success"),
        msg1: req.flash("error"),
      });
    } catch (error) {
      console.log(error);
    }
  };
  static Register = async (req, res) => {
    try {
      // res.render('Register')
      res.render("Register", {
        message: req.flash("error"),

        msg: req.flash("success"),
      });
    } catch (error) {
      console.log(error);
    }
  };

  static contact = async (req, res) => {
    try {
      const { name, image } = req.userdata;
      res.render("contact", { n: name, i: image });
      // res.render('contact')
    } catch (error) {
      console.log(error);
    }
  };

  static userInsert = async (req, res) => {
    try {
      // console.log(req.files)
      // const file = req.files.image
      // const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, { folder: "profiles" })
      // console.log(imageUpload)
      // console.log(file)
      const { username, email, pass, conpass, image } = req.body;
      const user = await usermodel.findOne({ email: email });
      if (user) {
        req.flash("error", "Email already Exit");
        res.redirect("/Register");
      } else {
        if (username && pass && conpass) {
          if (pass == conpass) {
            const hashPassword = await bcrypt.hash(pass, 10);
            const file = req.files.image;
            const imageUpload = await cloudinary.uploader.upload(
              file.tempFilePath,
              { folder: "profiles" }
            );
            const result = new usermodel({
              name: username,
              email: email,
              password: hashPassword,
              image: {
                public_id: imageUpload.public_id,
                url: imageUpload.secure_url,
              },
            });

            // To save data

            const userdata = await result.save();
            // console.log(userdata)
            if (userdata) {
              const token = jwt.sign({ ID: userdata._id }, "xkdfjd4dkfgd");
              // console.log(token)
              res.cookie("token", token);
              this.sendVerifymail(username, email, userdata._id);

              // to redirect to login page
              req.flash(
                "success",
                "Your Registration has been successfully. Please verify your Mail."
              );
              res.redirect("/Register");
            } else {
              req.flash("error", "Not Register.");
              res.redirect("/Register");
            }
            // req.flash("success", "Register Successfull ! Please Login");
            // res.redirect("/");
          } else {
            req.flash("error", "Password & Confirm Password must be same.");
            res.redirect("/Register");
          }
        } else {
          req.flas("error", "All Field are Required>");
          res.redirect("/Register");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  static sendVerifymail = async (username, email, userdata_id) => {
    //console.log(name, email, user_id);
    // connenct with the smtp server

    let transporter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,

      auth: {
        user: "soravrathor786@gmail.com",
        pass: "ujxfdqoozbsjmlqr",
      },
    });
    let info = await transporter.sendMail({
      from: "test@gmail.com", // sender address
      to: email, // list of receivers
      subject: "For Verification mail", // Subject line
      text: "heelo", // plain text body
      html:
        "<p>Hii " +
        username +
        ',Please click here to <a href="https://admissionportalproject-tcbi.onrender.com/verify?id=' +
        userdata_id +
        '">Verify</a>Your mail</p>.',
    });
    //console.log(info);
  };

  static verifyMail = async (req, res) => {
    try {
      const updateinfo = await usermodel.findByIdAndUpdate(req.query.id, {
        is_verified: 1,
      });
      if (updateinfo) {
        res.redirect('/home')
      }
    } catch (error) {
      console.log(error)
    }
  }

  static verifyLogin = async (req, res) => {
    try {
      // console.log(req.body)
      const { email, password } = req.body;
      const user = await usermodel.findOne({ email: email });
      if (user != null) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          if (user.role == "admin") {
            // token create
            var token = jwt.sign({ ID: user._id }, "xkdfjd4dkfgd");
            // console.log(token)
            res.cookie("token", token);
            res.redirect("/Admin/dashboard");
          }

          if (user.role == "user") {
            // token create
            var token = jwt.sign({ ID: user._id }, "xkdfjd4dkfgd");
            // console.log(token)
            res.cookie("token", token);
            res.redirect("/home");
          }
        } else {
          req.flash("error", "Email or Password is not valid.");
          res.redirect("/");
        }
      } else {
        req.flash("error", "You are not registerd user.");
        res.redirect("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  static profile = async (req, res) => {
    try {
      const { name, image, email } = req.userdata;
      res.render("profile", {
        n: name,
        i: image,
        e: email,
      });
    } catch (error) {
      console.log(error);
    }
  };

  static changePassword = async (req, res) => {
    try {
      const { id } = req.userdata;
      const { op, np, cp } = req.body;
      if (op && np && cp) {
        const user = await usermodel.findById(id);
        const isMatch = await bcrypt.compare(op, user.password);
        // console.log(isMatch)
        if (!isMatch) {
          req.flash("error", "current password is incorrect");
          res.redirect("/profile");
        } else {
          if (np != cp) {
            req.flash("error", "Password does not match");
            res.redirect("/profile");
          } else {
            const newhashpassword = await bcrypt.hash(np, 10);
            await usermodel.findByIdAndUpdate(id, {
              password: newhashpassword,
            });
            req.flash("success", "Password Update Successfully");
            res.redirect("/");
          }
        }
      } else {
        req.flash("error", "All field are rquired");
        res.redirect("/profile");
      }
    } catch (error) {
      console.log(errror);
    }
  };

  static ForgetPasswordVerify = async (req, res) => {
    try {
      const { email } = req.body;
      const userdata = await usermodel.findOne({ email: email });
      // console.log(userdata)
      if (userdata) {
        const randomString = randomstring.generate();
        await usermodel.updateOne(
          { email: email },
          { $set: { token: randomString } }
        );
        this.sendEmail(userdata.name, userdata.email, randomString);
        req.flash("success", "Plz check mail to reset your password");
        res.redirect("/");
      } else {
        req.flash("error", "you are not a registered Email");
        req.redirect("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  static sendEmail = async (name, email, token) => {
    // console.log(name,email,status,comment)
    // connenct with the smtp server

    let transporter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,

      auth: {
        user: "soravrathor786@gmail.com",
        pass: "ujxfdqoozbsjmlqr",
      },
    });
    let info = await transporter.sendMail({
      from: "test@gmail.com", // sender address
      to: email, // list of receivers
      subject: "Reset Password", // Subject line
      text: "heelo", // plain text body
      html:
        "<p>Hii " +
        name +
        ',Please click here to <a href="http://localhost:3000/reset-password?token=' +
        token +
        '">Reset</a>Your Password.',
    });
  };

  static reset_password = async (req, res) => {
    try {
      const token = req.query.token;
      const tokenData = await usermodel.findOne({ token: token });
      
      if (tokenData) {
        res.render("reset-password", { user_id: tokenData._id });
      } else {
        res.render("404");
      }
    } catch (error) {
      console.log(error);
    }
  };

  static reset_password1 = async (req, res) => {
    try {
      const { password, user_id } = req.body;
      const newhashpassword = await bcrypt.hash(password, 10);
      await usermodel.findByIdAndUpdate(user_id, {
        password: newhashpassword,
        token: "",
      });
      req.flash("success", "Reset Password Updated Successfully");
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  };

  static updateProfile = async (req, res) => {
    try {
      const { id } = req.userdata;
      const { name, email } = req.body;
      if (req.files) {
        const user = await usermodel.findById(id);
        const imageId = user.image.public_id;
        // console.log(imageId);

        // deleting image in cloudnary

        await cloudinary.uploader.destroy(imageId);

        // new image update

        const imagefile = req.files.image;
        const imageUpload = await cloudinary.uploader.upload(
          imagefile.tempFilePath,
          {
            folder: "userprofile",
          }
        );

        var data = {
          name: name,
          email: email,
          image: {
            public_id: imageUpload.public_id,
            url: imageUpload.secure_url,
          },
        };
      } else {
        var data = {
          name: name,
          email: email,
        };
      }
      await usermodel.findByIdAndUpdate(id, data);
      req.flash("success", "Update Profile successfully");
      res.redirect("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  static logout = async (req, res) => {
    try {
      res.clearCookie("token");

      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = FrontController;
