require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const inventoryRoutes = require("./routes/inventoryRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes"); // Add invoice routes

const app = express();

// Database connection
connection();

// Middlewares
app.use(express.json()); // Parse JSON requests
app.use(cors());         // Enable Cross-Origin Resource Sharing

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/inventory", inventoryRoutes); // Add inventory routes
app.use("/api/invoices", invoiceRoutes);   // Add invoices routes

// Health Check Route
app.get("/", (req, res) => {
  res.send("Server is running successfully.");
});

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
