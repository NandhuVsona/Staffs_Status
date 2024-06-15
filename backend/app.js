const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
// const { verify } = require("crypto");
const jwt = require("jsonwebtoken");
const Tour = require("./models/staffModel");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const multer = require("multer");
const ejs = require("ejs");
const { StatsFs } = require("fs");
const { error } = require("console");
//const staffRoutes = require("./routes/staffRouter");

//const uploads = multer({dest:'/Staffs Status/backend/uploads/'})

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../public/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

let uploads = multer({ storage: storage }).single("profile");

app.use(cors());
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "..", "public")));
// app.use("/", express.static(path.join(__dirname, "..", "public", "uploads")));
app.use(
  "/overview",
  express.static(path.join(__dirname, "..", "public", "uploads"))
);
app.use("/overview", express.static(path.join(__dirname, "..", "public")));
app.use(
  "/myaccount",
  express.static(path.join(__dirname, "..", "public", "uploads"))
);
app.use("/optimize", express.static(path.join(__dirname, "..", "public")));
app.use("/myaccount", express.static(path.join(__dirname, "..", "public")));
app.use("/api/v1/staffs", express.static(path.join(__dirname, "..", "public")));
app.use(
  "/api/v1/staffs",
  express.static(path.join(__dirname, "..", "public", "uploads"))
);

// app.use('/',staffRoutes) //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

// module.exports = app;

const isLogin = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      const docode = await promisify(jwt.verify)(
        req.cookies.jwt,
        "n1a2v3e4e5n6"
      );
      const isUserFound = await Tour.findOne({ _id: docode.id });
      if (isUserFound) {
        next();
      } else {
        res.status(200).render("signin.ejs");
      }
    } else {
      res.status(200).render("signin.ejs");
    }
  } catch (err) {
    res.status(400).json({ err });
  }
};
app.get("/", isLogin, async (req, res) => {
  const docode = await promisify(jwt.verify)(req.cookies.jwt, "n1a2v3e4e5n6");
  const isUserFound = await Tour.findOne({ _id: docode.id });
  let query = { ...req.query };
  let data = await Tour.find(query, {
    name: 1,
    position: 1,
    image: 1,
    department: 1,
  }).sort("name");
  res.status(200).render("home.ejs", { staffs: data, user: isUserFound });
});

app.get("/signup", (req, res) => res.status(200).render("signup.ejs"));

app.get("/optimize/:id", isLogin, async (req, res) => {
  try {
    let data = await Tour.findOne({ _id: req.params.id });
    res.status(200).render("update.ejs", { staff: data });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

app.post("/home", uploads, async (req, res) => {
  try {
    let saltRounds = 10;
    let salt = await bcrypt.genSalt(saltRounds);
    let hashedPassword = await bcrypt.hash(req.body.password, salt);

    const staff = new Tour({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      department: req.body.department,
      position: req.body.position,
      location: req.body.location,
      gender: req.body.gender,
      image: req.file.filename,
    });
    console.log(staff);
    await staff.save();

    res.status(200).render("signin.ejs", {
      msg: "Successfully registered login to continue..",
    });
    // if (!req.file) {
    //   throw new Error("Image required. Please upload.");
    // }
  } catch (err) {
    res.status(500).render("signup.ejs", { msg: err.message });
  }
});

app.post("/", async (req, res) => {
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
});

app.get("/api/v1/staffs", isLogin, async (req, res) => {
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
});

app.get("/overview/:id", isLogin, async (req, res) => {
  const id = req.params.id;
  const staff = await Tour.findOne({ _id: id });
  res.status(200).render("overview.ejs", { staff: staff });
});

app.get("/api/v1/overview/:id", async (req, res) => {
  const id = req.params.id;
  const staff = await Tour.findOne({ _id: id });
  res.status(200).json({
    status: "success",
    staff,
  });
});

app.post("/logout", async (req, res) => {
  res.cookie("jwt", "Logout", {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
    message: "Successfully Logout.!",
  });
});

// app.get("/database/reset", async (req, res) => {
//   await Tour.deleteMany();
//   res.redirect("/");
// });

app.get("/myaccount", isLogin, async (req, res) => {
  try {
    const docode = await promisify(jwt.verify)(req.cookies.jwt, "n1a2v3e4e5n6");
    const isUserFound = await Tour.findOne({ _id: docode.id });
    res.status(200).render("account.ejs", { staff: isUserFound });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

app.patch("/api/v1/myaccount/attendance/:id", async (req, res) => {
  const id = req.params.id; // Get the id from params
  const newData = req.body.status; // Assuming your data is structured properly in req.body
  let incrementField;
  if (newData === "present") {
    incrementField = "count.totalPresent";
  } else if (newData === "absent") {
    incrementField = "count.totalAbsent";
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let date = new Date().toDateString();

  let today = days[new Date().getDay()];
  try {
    let isExist = await Tour.findOne(
      { _id: id },
      { date: 1, status: 1, _id: 0 }
    );
    if (isExist.date.length != 0) {
      let isExistDate = isExist.date[isExist.date.length - 1]
        .split(" ")
        .slice(0, 4)
        .join(" ");

      if (isExistDate == date) {
        let staff = await Tour.findOne({ _id: id });
        return res.status(201).json({
          status: "Success",
          message:
            "Can't change " +
            date +
            " attendance alreday updated as " +
            isExist.status,
        });
      } else {
        let staff = await Tour.findOneAndUpdate(
          { _id: id },
          {
            status: newData,
            $push: { date: date + " " + newData },
            $inc: {
              [incrementField]: 1,
            },
          },
          { new: true }
        );

        res.status(201).json({
          status: "Success",
          message: `Successfully ${date} attendance is updated as ${newData}`,
        });
      }
    } else {
      let staff = await Tour.findOneAndUpdate(
        { _id: id },
        {
          status: newData,
          $push: { date: date + " " + newData },
          $inc: {
            [incrementField]: 1,
          },
        },
        { new: true }
      );

      res.status(201).json({
        status: "Success",
        message: `Successfully ${date} attendance is updated as ${newData}`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/dashboard", isLogin, async (req, res) => {
  try {
    let totalStaffs = await Tour.find();
    res.status(200).render("dashboard.ejs", { data: totalStaffs.length });
  } catch (err) {
    res.status(500).json(err);
  }
});

app.get("/api/v1/dashboard", isLogin, async (req, res) => {
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
    let absentStaffs = await Tour.find(
      { status: "absent" },
      { name: 1, department: 1, image: 1, _id: 1 }
    );

    res.status(200).json({
      status: "success",
      totalStaffs: stats.length,
      todayPresent: stats.length,
      stats,
      status,
      absentStaffs,
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

app.get("/api/v1/staffs/:dept", isLogin, async (req, res) => {
  const dept = req.params.dept.toUpperCase();

  const staffs = await Tour.find({ department: dept });
  res.status(200).json({
    message: "success",
    result: staffs.length,
    staffs,
  });
});

app.post("/optimized/:id", isLogin, async (req, res) => {
  try {
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

    data = {
      monday: schedule.monSchedule,
      tuesday: schedule.tueSchedule,
      wednesday: schedule.wedSchedule,
      thursday: schedule.thuSchedule,
      friday: schedule.friSchedule,
      saturday: schedule.satSchedule,
    };
    let updateStaff = await Tour.findByIdAndUpdate(req.params.id, data);
    let updatedStaff = await Tour.findById(req.params.id, { password: 0 });
    res.status(200).redirect("/myaccount");
  } catch (err) {
    res.status(500).json(err.message);
  }
});

app.get("/internal-mark-calculator", (req, res) => {
  try {
    res.status(200).render("internalC.ejs");
  } catch (err) {
    res.status(500).json(err.message);
  }
});

app.get("/settings", isLogin, async (req, res) => {
  try {
    const docode = await promisify(jwt.verify)(req.cookies.jwt, "n1a2v3e4e5n6");
    const isUserFound = await Tour.findOne({ _id: docode.id });
    res.status(200).render("settings.ejs", { staff: isUserFound });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

app.patch("/api/v1/update/:id", isLogin, async (req, res) => {
  try {
    const data = req.body;
    const staff = await Tour.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      status: "ok",
      message: "Successfully Updated.!",
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

app.delete("/account/:id", isLogin, async (req, res) => {
  const query = req.params.id;
  try {
    // Assuming Tour is your model and you're trying to delete a document by ID
    let { image } = await Tour.findOne({ _id: query });
    if (image) {
      fs.unlink(
        path.join(__dirname, "..", "public", "uploads", image),
        async (err) => {
          let staff = await Tour.deleteOne({ _id: query });
          res.status(200).json({
            status: "ok",
            message: "Successfuly Deleted.!",
          });
        }
      );
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

app.patch("/api/v1/password/:id", isLogin, async (req, res) => {
  try {
    const staff = await Tour.findById(req.params.id);

    if (!staff) {
      return res.status(404).json({
        status: "failed",
        message: "404 user not found.!",
      });
    }

    const isCorrect = await bcrypt.compare(req.body.oldPass, staff.password);

    if (!isCorrect) {
      return res.status(400).json({
        status: "Failed",
        message: "Incorrect password.!",
      });
    }
    const saltRound = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(req.body.newPass, saltRound);
    const updateNewPass = await Tour.findByIdAndUpdate(req.params.id, {
      password: hashedPassword,
    });
    return res.status(201).json({
      status: "Success",
      message: "Password changed successfully.!",
    });
  } catch (err) {
    res.status(500).send(err);
  }
});
module.exports = app;
