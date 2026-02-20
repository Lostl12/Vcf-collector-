const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public")); // if your html is in public folder

// ✅ MongoDB connection
mongoose.connect("mongodb+srv://ebukaanyemachill9_db_mer:joy5RIFZWLFC35WL@cluster0.bcrir9p.mongodb.net/vcfcollector?retryWrites=true&w=majority")
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.log("❌ MongoDB error:", err));

// ✅ Schema
const ContactSchema = new mongoose.Schema({
  number: { type: String, unique: true }
});

const Contact = mongoose.model("Contact", ContactSchema);

// ✅ Save contact
app.post("/save", async (req, res) => {
  try {
    const { number } = req.body;

    if (!number) {
      return res.json({ success: false, msg: "No number" });
    }

    const exists = await Contact.findOne({ number });

    if (exists) {
      return res.json({ success: false, msg: "Duplicate" });
    }

    await Contact.create({ number });

    const count = await Contact.countDocuments();

    res.json({
      success: true,
      count: count
    });

  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});

// ✅ Get stats
app.get("/stats", async (req, res) => {
  const count = await Contact.countDocuments();
  res.json({ count });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🚀 Server running on", PORT));
