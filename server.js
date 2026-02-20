import express from "express";
import mongoose from "mongoose";
import path from "path";

const app = express();
app.use(express.json());
app.use(express.static("public"));

// --- Connect to MongoDB Atlas ---
const mongoURI = "mongodb+srv://ebukaanyemachill9_db_mer:joy5RIFZWLFC35WL@cluster0.bcrir9p.mongodb.net/vcfcollector?retryWrites=true&w=majority";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

// --- Schema ---
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true }
});

const Contact = mongoose.model("Contact", contactSchema);

// --- Target count ---
const TARGET = 500;

// --- Submit contact ---
app.post("/save", async (req, res) => {
  const { name, phone } = req.body;
  if(!name || !phone) return res.json({ error: "Fill all fields" });

  try {
    const count = await Contact.countDocuments();
    if(count >= TARGET) return res.json({ target: TARGET, count, ready: true });

    // Prevent duplicates
    const existing = await Contact.findOne({ phone });
    if(existing) return res.json({ error: "Number already submitted" });

    // Save new contact
    await Contact.create({ name, phone });

    const newCount = await Contact.countDocuments();
    res.json({ target: TARGET, count: newCount, ready: newCount >= TARGET });
  } catch(err) {
    console.log(err);
    res.json({ error: err.message });
  }
});

// --- Get current counts ---
app.get("/count", async (req, res) => {
  try {
    const count = await Contact.countDocuments();
    res.json({ target: TARGET, count, ready: count >= TARGET });
  } catch(err) {
    res.json({ error: err.message });
  }
});

// --- Download VCF ---
app.get("/download", async (req, res) => {
  try {
    const contacts = await Contact.find();
    let vcf = "";
    contacts.forEach(c => {
      vcf += `BEGIN:VCARD\nVERSION:3.0\nFN:${c.name}\nTEL:${c.phone}\nEND:VCARD\n`;
    });
    res.setHeader("Content-Type", "text/vcard");
    res.setHeader("Content-Disposition", "attachment; filename=contacts.vcf");
    res.send(vcf);
  } catch(err) {
    res.send("Error fetching contacts");
  }
});

// --- Serve frontend ---
app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
