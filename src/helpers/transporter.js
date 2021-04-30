const { createTransport } = require("nodemailer");
let transporter = createTransport({
  service: "gmail",
  auth: {
    user: "dedimashuri1996@gmail.com",
    pass: "abc123",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = transporter;
