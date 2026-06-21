const express = require("express");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");

const path = require("path");

const app = express();

// Database Connection
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Files
app.use(express.static("public"));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

// Frontend Routes

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "register.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "dashboard.html"));
});

app.get("/jobs", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "jobs.html"));
});

app.get("/profile", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "profile.html"));
});

// 404 Route
app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});