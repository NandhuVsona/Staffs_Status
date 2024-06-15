const mongoose = require("mongoose");
const validator = require('validator')

const studentSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required:[true,'Please tell us your name!']
  },
  email: {
    type: String,
    trim: true,
    lowercase:true,
    required:[true,'Please provide your email'],
    validate: [validator.isEmail,'Please provide a valid email']
  },
  password: {
    type: String,
    trim: true,
    required : [true,'Please provide a passoword'],
    minlength:8
  },
  passwordConfirm:{
    type: String,
    trim: true,
    required : [true,'Please provide a passoword']
  },
  image: {
    type: String,
  },
});

const student = mongoose.model("Student", studentSchema);
module.exports = student;
