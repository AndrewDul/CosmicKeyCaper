const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/cosmic-runner", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  level: Number,
});

const User = mongoose.model("User", userSchema);

// Register endpoint
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const user = new User({ email, password, level: 1 });
  await user.save();
  res.json({ success: true });
});

// Login endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (user) res.json({ success: true });
  else res.status(401).json({ success: false });
});

// Save level endpoint
app.post("/save-level", async (req, res) => {
  const { level } = req.body;
  await User.updateOne({ email: "test@example.com" }, { level });
  res.json({ success: true });
});

app.listen(3000, () => console.log("Server running on port 3000"));
