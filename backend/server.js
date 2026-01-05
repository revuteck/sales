const express = require('express');
const cors = require("cors");
const app = express();
const db = require('./src/config/db')
const PORT = process.env.PORT || 5000;

// ---- ENABLE CORS BEFORE ROUTES ----
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// Allow JSON data
// app.use(express.json());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// Test Route
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", time: new Date() });
});

app.get("/", (req, res) => {
    res.send("Server is running..!");
});

// Register DB Routes
const candidateRoutes = require("./src/routes/candidateRoutes");
app.use("/api/candidates", candidateRoutes);

//Login Routes
const authRoutes = require("./src/routes/authRoutes");
app.use("/api/auth", authRoutes);

//add new employee
const employeeRoutes = require("./src/routes/employeeRoutes");
app.use("/api/employee", employeeRoutes);

//Bulk data add
const bulkCandidates = require("./src/routes/addBulk")
app.use("/api/bulk/candidates", bulkCandidates)

//countries data
const countryRoute = require("./src/routes/countryRoute")
app.use("/api/country", countryRoute)
// Start Server
app.listen(PORT, () => 
    console.log(`Server running on port ${PORT}`)
);
