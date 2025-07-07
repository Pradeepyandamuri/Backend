require("dotenv").config();
const express = require("express");
const cors = require("cors");

const taskRoutes = require("./routes/tasks");
const authRoutes = require("./routes/auth");
const scheduleTaskReminders = require("./utils/scheduler");
const app = express();
const PORT = process.env.PORT || 5000;
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);
app.use(express.json());
app.use("/tasks", taskRoutes);
app.use("/auth", authRoutes);
scheduleTaskReminders();
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
