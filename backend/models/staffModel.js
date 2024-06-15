const mongooes = require("mongoose");
const validator = require("validator");
const type = require("mongoose/lib/schema/operators/type");
let staffShceme = new mongooes.Schema({
  name: {
    type: String,
    required: [true, "Name required. Please provide."],
    trim: true,
    minlength: 4,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email required. Please provide."],
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Password required. Please provide."],
  },
  department: {
    type: String,
    trim: true,
    required: [true, "Department required. Please provide."],
  },
  gender: {
    type: String,
  },
  position: {
    type: String,
    trim: true,
    required: [true, "Position required. Please provide."],
  },
  location: {
    type: String,
    trim: true,
    required: [true, "Location required. Please provide."],
  },
  monday: {
    type: { String },
    trim: true,
  },
  tuesday: {
    type: { String },
    trim: true,
  },
  wednesday: {
    type: { String },
    trim: true,
  },
  thursday: {
    type: { String },
    trim: true,
  },
  friday: {
    type: { String },
    trim: true,
  },
  saturday: {
    type: { String },
    trim: true,
  },
  image: {
    type: String,
    default: "male.png",
    // required: true,
    // required: [true, "Image required. Please Upload."],
  },
  status: {
    type: String,
    default: "present",
  },
  date: [
    {
      type: String,
    },
  ],
  count: {
    totalPresent: {
      type: Number,
      default: 0,
    },
    totalAbsent: {
      type: Number,
      default: 0,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],

  whatsappNumber: {
    type: String,
    default: "Whatsapp number is not yet added.!",
    // minlength: [10, "Number must be 10 digits"],
    // maxlength: [10, "Number must be 10 digits"],
  },

  phoneNumber: {
    type: String,
    default: "Phone numer is not yet added.!",
    // minlength: [10, "Number must be 10 digits"],
    // maxlength: [10, "Number must be 10 digits"],
  },
});

const Tour = mongooes.model("Staffs", staffShceme);

module.exports = Tour;
