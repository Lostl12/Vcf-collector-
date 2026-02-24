import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

/* ================= DB CONNECT ================= */

mongoose.connect(process.env.MONGO_URI, {
  dbName: "vcfcollector"
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

/* ================= MODEL ================= */

const contactSchema = new mongoose.Schema({
  number: { type: String, unique: true }
});

const Contact = mongoose.model("contacts", contactSchema);

/* ================= ROUTES ================= */

// Save contact
app.post("/save", async (req, res) => {
  try {
    const { number } = req.body;

    if (!number) {
      return res.json({ status: "error", msg: "No number" });
    }

    const exists = await Contact.findOne({ number });

    if (exists) {
      return res.json({ status: "duplicate" });
    }

    await Contact.create({ number });

    const count = await Contact.countDocuments();

    res.json({
      status: "saved",
      count
    });

  } catch (err) {
    res.json({ status: "error" });
  }
});

// Stats
app.get("/stats", async (req, res) => {
  const count = await Contact.countDocuments();
  res.json({ count });
});

/* ================= START ================= */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
