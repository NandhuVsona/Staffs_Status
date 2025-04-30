const nodeMailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config({ path: "../env" });

const sendEmail = async (options) => {
  // 1 ) Create a transporter

  const transporter = nodeMailer.createTransport({
    secure: true,
    host: "smtp.gmail.com",
    port: "465",
    auth: {
      user: "naveenv7574@gmail.com",
      // pass: "uljp xefb tbkq edag",
      pass:"mwto rwov xqjp ztbc"
    },
  });

  // 2) Define the eamil options

  const mailOptions = {
    from: `Staffs Status <${process.env.EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
