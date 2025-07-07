require("dotenv").config();
const sendReminderEmail = require("./utils/emailService");

const test = async () => {
  const recipient = "pradeepyandamuri532@gmail.com"; // ✅ Change this to your Gmail
  const subject = "📨 Test Email from Task Scheduler";
  const message = "✅ This is a test email to confirm email setup is working.";

  await sendReminderEmail(recipient, subject, message);
};

test();
