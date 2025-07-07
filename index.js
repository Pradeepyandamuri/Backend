require("dotenv").config();
const express = require("express");
const cors = require("cors");

const taskRoutes = require("./routes/tasks");
const authRoutes = require("./routes/auth");
const scheduleTaskReminders = require("./utils/scheduler");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Proper CORS configuration
const allowedOrigins = [
  "http://localhost:3000",                        // for local development
  "https://frontend-beryl-chi-ofygdo9re7.vercel.app"           // replace this with your actual deployed Vercel frontend URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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
