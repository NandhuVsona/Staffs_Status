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
require("dotenv").config();
const twilio = require("twilio");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH;

const client = twilio(accountSid, authToken);

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
app.use("/", express.static(path.join(__dirname, "..", "public")));

// app.use('/',staffRoutes) //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// const sendEmail = require("./utils/email.js"); // Adjust path as needed

// app.get("/api/v1/staffs/send", async (req, res) => {
//   try {
//     const now = new Date();
//     const currentHour = now.getHours();

//     const days = [
//       "sunday",
//       "monday",
//       "tuesday",
//       "wednesday",
//       "thursday",
//       "friday",
//       "saturday",
//     ];
//     const currentDay = days[now.getDay()];

//     if (currentDay === "sunday") {
//       return res.status(200).json({ message: "Today is Sunday. No classes." });
//     }

//     let period = null;
//     if (currentHour === 19) period = "firstPeriod";
//     else if (currentHour === 10) period = "secondPeriod";
//     else if (currentHour === 11) period = "thirdPeriod";
//     else if (currentHour === 12) period = "fourthPeriod";
//     else if (currentHour === 13) {
//       return res
//         .status(200)
//         .json({ message: "Lunch break. No reminders sent." });
//     } else if (currentHour === 14) period = "fifthPeriod";
//     else if (currentHour === 15) period = "sixthPeriod";
//     else if (currentHour === 16) period = "seventhPeriod";
//     else {
//       return res
//         .status(200)
//         .json({ message: "Outside college hours. No reminders sent." });
//     }

//     const staffWithClasses = await Tour.find({
//       notification: true,
//       [`${currentDay}.${period}`]: { $ne: "" },
//     });

//     if (!staffWithClasses.length) {
//       return res
//         .status(200)
//         .json({ message: `No staff with class in ${period}` });
//     }

//     let count = 0;

//     for (const staff of staffWithClasses) {
//       const classDetails = staff[currentDay][period];
//       if (!classDetails || classDetails.trim() === "") continue;
//       const messageContent = `
// <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 10px;  min-height: 100vh;">
//   <div  border-radius: 12px; padding: 20px 0px;">
//     <!-- Header -->
//     <div style="text-align: center; margin-bottom: 24px;">
//       <div style="font-size: 20px; color: #00cc88; margin-bottom: 4px;">Class Reminder</div>
//       <div style="font-size: 11px; ">Academic Schedule Notification</div>
//     </div>

//     <!-- Date/Period -->
//     <div style=" border-radius: 8px; padding: 8px; margin-bottom: 20px;">
//       <div style="margin-bottom: 12px;">
//         <div style="font-size: 12px;  margin-bottom: 2px;">Date</div>
//         <div style="color: #00cc88; font-size: 14px;">${now.toDateString()}</div>
//       </div>
//       <div>
//         <div style="font-size: 12px;  margin-bottom: 2px;">Period</div>
//         <div style="color: #00cc88; font-size: 14px;">${period.replace("Period", " Period")}</div>
//       </div>
//     </div>

//     <!-- Greeting -->
//     <div style="margin-bottom: 24px;">
//       <p style=" margin: 0 0 16px 0; font-size: 14px;">Dear ${staff.name},</p>
//       <p style=" margin: 0; font-size: 13px; line-height: 1.4;">Please be reminded of your scheduled class today:</p>
//     </div>

//     <!-- Class Details -->
//     <div style=" border-radius: 8px; padding: 16px;">
//       <div style="font-size: 14px; color: #00cc88; margin-bottom: 12px;">Class Details</div>
//       <div style="font-size: 13px;  line-height: 1.5;">
//         <div style="margin-bottom: 10px;">🗓️ <strong>Day:</strong> ${currentDay}</div>
//         <div style="margin-bottom: 10px;">⏳ <strong>Period:</strong> ${period}</div>
//         <div>📚 <strong>Details:</strong> ${classDetails}</div>
//       </div>
//     </div>

//     <!-- Footer -->
//     <div style="text-align: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid #2d2d2d;">
//       <div style="font-size: 11px;  line-height: 1.4;">
//         <div>Best regards,</div>
//         <div style="color: #00cc88; margin-top: 4px;">Manoranjitham K G</div>
//         <div style="margin-top: 8px;">Student at the Department of ECE</div>
//       </div>
//     </div>
//   </div>
// </div>

//     `;

//       await sendEmail({
//         email: staff.email,
//         subject: `Class Reminder - ${period} (${currentDay})`,
//         message: messageContent,
//       });

//       count++;
//     }

//     res.status(200).json({
//       message: `Reminder emails sent to ${count} staff(s).`,
//       currentDay,
//       period,
//       totalStaff: count,
//     });
//   } catch (error) {
//     console.error("Reminder send error:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to send reminders", error: error.message });
//   }
// });

const unirest = require("unirest");

console.log({ accountSid, authToken });

app.get("/api/v1/staffs/send-sms", async (req, res) => {
  try {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const classTimings = {
      "04:50": "firstPeriod",
      [process.env.SECOND_PERIOD_TIME]: "secondPeriod",
      [process.env.THIRD_PERIOD_TIME]: "thirdPeriod",
      [process.env.FOURTH_PERIOD_TIME]: "fourthPeriod",
      [process.env.FIFTH_PERIOD_TIME]: "fifthPeriod",
      [process.env.SIXTH_PERIOD_TIME]: "sixthPeriod",
      [process.env.SEVENTH_PERIOD_TIME]: "seventhPeriod",
    };

    // Format current time as HH:MM
    const nowKey = `${String(currentHour).padStart(2, "0")}:${String(
      currentMinute
    ).padStart(2, "0")}`;

    // Check for lunch break between 12:55 and 13:54
    if (
      (currentHour === 12 && currentMinute >= 55) ||
      (currentHour === 13 && currentMinute < 55)
    ) {
      return res
        .status(200)
        .json({ message: "Lunch break. No reminders sent." });
    }

    const period = classTimings[nowKey];
    if (!period) {
      return res
        .status(200)
        .json({ message: "Outside class reminder window." });
    }

    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const currentDay = days[now.getDay()];

    if (currentDay === "sunday") {
      return res
        .status(200)
        .json({ message: "It's Sunday. No reminders needed." });
    }

    const staffWithClasses = await Tour.find({
      notification: true,
      [`${currentDay}.${period}`]: { $ne: "" },
    });

    if (!staffWithClasses.length) {
      return res
        .status(200)
        .json({ message: `No classes scheduled for ${period}.` });
    }

    let successCount = 0;
    const failedNumbers = [];

    await Promise.all(
      staffWithClasses.map(async (staff) => {
        try {
          const classDetails = staff[currentDay][period];
          const phone = staff.phoneNumber?.trim();

          if (!classDetails?.trim()) return;

          if (!phone) {
            failedNumbers.push({
              name: staff.name,
              reason: "Phone number not provided",
            });
            return;
          }

          const bodyMessage =
            `Hello ${staff.name},\n\n` +
            `This is a reminder for your upcoming class:\n\n` +
            `Day    : ${currentDay.toUpperCase()}\n` +
            `Period : ${period}\n` +
            `Class  : ${classDetails}\n\n` +
            `Thank you. Have a great session.`;

          const response = await client.messages.create({
            body: bodyMessage,
            from: process.env.TWILIO_PHONE, // Your Twilio number
            to: `+91${phone}`, // Assuming Indian number
          });

          if (response.sid) {
            successCount++;
          } else {
            failedNumbers.push({
              name: staff.name,
              phone,
              reason: "Unknown error",
            });
          }
        } catch (error) {
          failedNumbers.push({
            name: staff.name,
            phone: staff.phoneNumber,
            reason: error.message,
          });
          console.error(`SMS failed for ${staff.phoneNumber}:`, error.message);
        }
      })
    );

    res.status(200).json({
      message: `SMS reminders sent`,
      successCount,
      failedCount: failedNumbers.length,
      failedNumbers,
      deliveryId: Date.now().toString(36),
    });
  } catch (error) {
    console.error("SMS Controller Error:", error);
    res.status(500).json({
      error: "SMS dispatch failure",
      reason: error.message,
    });
  }
});

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
  let hodsList = await Tour.find(
    { position: "HOD" },
    { image: 1, department: 1 }
  );

  res
    .status(200)
    .render("home.ejs", { staffs: data, hods: hodsList, user: isUserFound });
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

app.get("/api/v1/staffs", async (req, res) => {
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
