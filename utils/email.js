const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  jsonTransport: true, //for mock mail I'm using json
});

const sendAlert = async (userEmail, subject, message) => {
  const mailOptions = {
    from: "alerts@wallet.com",
    to: userEmail,
    subject,
    text: message,
  };

  const result = await transporter.sendMail(mailOptions);
  console.log("Mock Email Alert Sent:", result.message);
};

module.exports = sendAlert;
