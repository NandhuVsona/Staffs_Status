const student = require("../models/studentModel");

const singup = async (req, res, next) => {
  const newStudent = await student.create(req.body);
  res.status(201).json({
    status: "Success",
    student: newStudent,
  });
};

module.exports = singup