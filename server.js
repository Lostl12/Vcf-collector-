const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors()); // optional if you fetch from frontend on same domain

const TARGET = 500;

// MongoDB Atlas connection
const MONGO_URI = "mongodb+srv://ebukaanyemachill9_db_mer:joy5RIFZWLFC35WL@cluster0.bcrir9p.mongodb.net/vcfcollector?retryWrites=true&w=majority";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// Contact model
const ContactSchema = new mongoose.Schema({
  number: { type: String, unique: true }
});

const Contact = mongoose.models.Contact || mongoose.model("Contact", ContactSchema);

// ---------- Save contact ----------
app.post("/save", async (req, res) => {
  const { number } = req.body;
  if (!number) return res.json({ success: false, message: "No number provided" });

  await connectDB();

  try {
    await Contact.create({ number });
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: "Number already submitted" });
  }
});

// ---------- Get stats ----------
app.get("/stats", async (req, res) => {
  await connectDB();

  const count = await Contact.countDocuments();
  res.json({
    target: TARGET,
    contacts: count,
    remaining: TARGET - count
  });
});

// ---------- Start server ----------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
