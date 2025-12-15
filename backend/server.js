const express = require('express');
const cors = require("cors");
const app = express();
const db = require('./src/config/db')
const PORT = process.env.PORT || 5000;

// ---- ENABLE CORS BEFORE ROUTES ----
app.use(cors({
    origin: "https://rev-comp.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// Allow JSON data
app.use(express.json());

// Test Route
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

//get the candidates with emp id

// Start Server
app.listen(PORT, () => 
    console.log(`Server running on port ${PORT}`)
);
