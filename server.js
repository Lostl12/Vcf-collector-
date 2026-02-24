import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.static("public"));

// Fix strict query warning
mongoose.set('strictQuery', false);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { dbName: "vcfcollector" })
.then(()=>console.log("✅ MongoDB connected"))
.catch(err=>console.log("❌ MongoDB connection error:", err));

// Schema & model
const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  number: { type: String, unique: true, required: true }
});

const Contact = mongoose.model("contacts", ContactSchema);

// Routes
app.get("/count", async (req,res)=>{
  try{
    const total = await Contact.countDocuments();
    res.json({ total });
  }catch(err){
    res.json({ total: 0 });
  }
});

app.post("/save", async (req,res)=>{
  try {
    const { name, number } = req.body;
    if(!name || !number) return res.json({ status:"error", message:"Name and number required" });

    const exists = await Contact.findOne({ number });
    if(exists) return res.json({ status:"duplicate" });

    await Contact.create({ name, number });
    res.json({ status:"saved" });

  } catch(err){
    console.log("Error saving contact:", err);
    res.json({ status:"error" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log("Server running on port", PORT));
