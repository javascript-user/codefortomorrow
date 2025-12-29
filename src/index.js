require("dotenv").config();
const db = require("./config/db");
const express = require("express");
const authRoutes = require("./routes/auth.routes");
const app = express();

const port = process.env.PORT || 8080;

app.use(express.json());

app.use("/api", authRoutes);

app.get("/", (req, res) => {
  res.send("home");
});

app.listen(port, () => {
  console.log("server was listening", port);
  db();
});
