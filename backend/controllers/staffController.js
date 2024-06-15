const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const { promisify } = require("util");
// const { verify } = require("crypto");
const jwt = require("jsonwebtoken");
const Tour = require("../models/staffModel");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const multer = require("multer");
const ejs = require("ejs");
const { StatsFs } = require("fs");


const isLogin = async (req, res, next) => {
  if (req.cookies.jwt) {
    const docode = await promisify(jwt.verify)(req.cookies.jwt, "n1a2v3e4e5n6");
    const isUserFound = await Tour.findOne({ _id: docode.id });
    if (isUserFound) {
      let query = { ...req.query };
      let data = await Tour.find(query, {
        name: 1,
        position: 1,
        image: 1,
        department: 1,
      }).sort("name");
      // res.status(200).sendFile(path.join(__dirname, "views", "home.html"));
      res.status(200).render("home.ejs", { staffs: data, user: isUserFound });
    } else {
      next();
    }
  } else {
    next();
  }
};

const homePage = async (req, res) => {
  res.status(200).render("signin.ejs");
};

const singin = async (req, res) => {
  try {
    const user = await Tour.findOne({ email: req.body.email });

    if (user) {
      let iscorrect = await bcrypt.compare(req.body.password, user.password);

      if (iscorrect) {
        const id = user.id;
        const token = jwt.sign({ id: id }, process.env.SECRETKEY, {
          expiresIn: "90d",
        });
        const cookieOptions = {
          expires: new Date(Date.now() + 90 + 90 * 24 * 60 * 60 * 1000),
          httpOnly: true,
        };
        res.cookie("jwt", token, cookieOptions);
        return res.status(200).redirect("/");
      } else {
        return res.status(401).send("Password is incorrect");
      }
    } else {
      return res.status(401).send("Invalid email");
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const signupPage = async (req, res) => {
  res.status(200).render("signup.ejs");
};

const home = async (req, res) => {
  try {
    let saltRounds = 10;
    let salt = await bcrypt.genSalt(saltRounds);
    let hashedPassword = await bcrypt.hash(req.body.password, salt);

    const daysOfWeek = ["mon", "tue", "wed", "thu", "fri", "sat"];
    const schedule = {};

    daysOfWeek.forEach((day) => {
      schedule[`${day}Schedule`] = {
        firstPeriod: req.body[`${day}_first_period`] || " ",
        secondPeriod: req.body[`${day}_second_peroid`] || " ",
        thirdPeriod: req.body[`${day}_third_period`] || " ",
        fourthPeriod: req.body[`${day}_forth_peroid`] || " ",
        fifthPeriod: req.body[`${day}_fifth_period`] || " ",
        sixthPeriod: req.body[`${day}_sixth_period`] || " ",
        seventhPeriod: req.body[`${day}_seventh_period`] || " ",
      };
    });

    const staff = new Tour({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      department: req.body.department,
      position: req.body.position,
      location: req.body.location,
      gender: req.body.gender,
      monday: schedule.monSchedule,
      tuesday: schedule.tueSchedule,
      wednesday: schedule.wedSchedule,
      thursday: schedule.thuSchedule,
      friday: schedule.friSchedule,
      saturday: schedule.satSchedule,
      image: req.file.filename,
    });
    await staff.save();

    res.status(200).render("signin.ejs", {
      msg: "Successfully registered login to continue..",
    });
    if (!req.file) {
      throw new Error("Image required. Please upload.");
    }
  } catch (err) {
    res.status(500).render("signup.ejs", { msg: err.message });
  }
};

const getAllStaffs = async (req, res) => {
  try {
    let query = { ...req.query };
    let exculdedFields = { name: 1, position: 1, image: 1 };
    const staffs = await Tour.find(query, exculdedFields).sort("name");
    res.status(200).json({
      status: "success",
      result: staffs.length,
      data: staffs,
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const overview = async (req, res) => {
  const id = req.params.id;
  const staff = await Tour.findOne({ _id: id });
  res.status(200).render("overview.ejs", { staff: staff });
};

const getStaff = async (req, res) => {
  const id = req.params.id;
  const staff = await Tour.findOne({ _id: id });
  res.status(200).json({
    status: "success",
    result: staff.length,
    staff,
  });
};

const logout = async (req, res) => {
  res.cookie("jwt", "Logout", {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });
  res.status(200).render("signin.ejs");
};

const accountPage = async (req, res) => {
  try {
    const docode = await promisify(jwt.verify)(req.cookies.jwt, "n1a2v3e4e5n6");
    const isUserFound = await Tour.findOne({ _id: docode.id });
    res.status(200).render("account.ejs", { staff: isUserFound });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const getAccount = async (req, res) => {
  const query = req.params.id;

  try {
    // Assuming Tour is your model and you're trying to delete a document by ID
    let staff = await Tour.deleteOne({ _id: query });
    res.status(200).redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const updateStatus = async (req, res) => {
  try {
    const id = req.params.id; // Get the id from params
    const newData = req.body.data; // Assuming your data is structured properly in req.body
    try {
      let staff = await Tour.findOneAndUpdate(
        { _id: id },
        { status: newData },
        { new: true }
      );

      res.status(200).render("account.ejs", { staff: staff });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const dashboardPage = async (req, res) => {
  try {
    let totalStaffs = await Tour.find();
  
    res.status(200).render("dashboard.ejs", { data: totalStaffs.length });
    
  } catch (err) {
    res.status(500).json(err);
  }
};

const aggregation = async (req, res) => {
  try {
    let stats = await Tour.aggregate([
      {
        $group: {
          _id: "$department",
          totalStaffs: { $sum: 1 },
        },
      },
    ]);
    let status = await Tour.aggregate([
      {
        $match: {
          status: "absent", // Filter documents with status "present"
        },
      },
      {
        $group: {
          _id: "$department",
          totalStaffs: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json({
      status: "success",
      totalStaffs: stats.length,
      todayPresent: stats.length,
      stats,
      status,
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

module.exports = {
  isLogin,
  homePage,
  signupPage,
  singin,
  home,
  getAllStaffs,
  overview,
  getStaff,
  logout,
  accountPage,
  getAccount,
  updateStatus,
  dashboardPage,
  aggregation,
};
