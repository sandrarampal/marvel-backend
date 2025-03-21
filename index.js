require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI);

const characterRoutes = require("./routes/character");
const comicRoutes = require("./routes/comic");
const userRoutes = require("./routes/user");
app.use(cors());
app.use(express.json());
app.use(characterRoutes);
app.use(comicRoutes);
app.use(userRoutes);

app.get("/", (req, res) => {
  try {
    return res.status(200).json({ message: "Welcome to Marvel server" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "This route does not exist" });
});

app.listen(process.env.PORT, () => {
  console.log("Serveur has started");
});
