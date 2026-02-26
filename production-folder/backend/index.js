require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();


// IMPORTANT: Hostinger provides PORT automatically
const PORT = process.env.PORT || 5000;

// ---- MIDDLEWARES ----
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// ---- NO CACHE ----
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

// ---- API ROUTES (FIRST) ----
app.get("/api/version", (req, res) => {
  res.json({ version: "PROD-2026-01-06" });
});

// app.get("/api/health", (req, res) => {
//   res.json({ status: "OK", time: new Date() });
// });

app.use(cors({
  origin: [
    "http://localhonost:5173",
    "http://localhost:3000",
    "https://sales.revuteck.in"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use("/api/candidates", require("./src/routes/candidateRoutes"));
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/employee", require("./src/routes/employeeRoutes"));
app.use("/api/bulk/candidates", require("./src/routes/addBulk"));
app.use("/api/country", require("./src/routes/countryRoute"));

// ---- REACT STATIC FILES ----
app.use(express.static(path.join(__dirname, "dist")));

// ---- REACT ROUTER FALLBACK (LAST!) ----
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// ---- START SERVER ----
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
