const usermodel = require("../models/user");
const cloudinary = require("cloudinary");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const courseModel = require("../models/course");
cloudinary.config({
  cloud_name: "dwovzxxol",
  api_key: "227631891845838",
  api_secret: "fF1pNSbC9dBhtUDQr5XEbkErkww", // Click 'View API Keys' above to copy your API secret
});
class FrontController {
  static home = async (req, res) => {
    try {
      const { name, image, email, id, role } = req.userdata;
      const btech = await courseModel.findOne({ user_id: id, course: "btech" })
      const bca = await courseModel.findOne({ user_id: id, course: "bca" });
      const mca = await courseModel.findOne({ user_id: id, course: "mca" });
      res.render("home", { n:name, i: image, e: email, btech:btech,bca:bca,mca:mca, r:role });
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
      res.render("Register", { message: req.flash("error") });
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

            await result.save();
            req.flash("success", "Register Successfull ! Please Login");
            res.redirect("/");
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
