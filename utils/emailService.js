const nodemailer = require("nodemailer");

async function sendReminderEmail(to, subject, message) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // use an App Password here
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(" Email sent:", info.response);
  } catch (err) {
    console.error(" Email sending failed:", err); // 🔥 Full error logged
  }
}

module.exports = sendReminderEmail;
