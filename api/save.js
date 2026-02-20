import mongoose from "mongoose";

const MONGO_URI = "mongodb+srv://ebukaanyemachill9_db_mer:joy5RIFZWLFC35WL@cluster0.bcrir9p.mongodb.net/vcfcollector?retryWrites=true&w=majority";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(m => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

const ContactSchema = new mongoose.Schema({
  number: { type: String, unique: true }
});

const Contact = mongoose.models.Contact || mongoose.model("Contact", ContactSchema);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { number } = req.body;
  if (!number) return res.json({ success: false, message: "No number provided" });

  await connectDB();

  try {
    await Contact.create({ number });
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: "Number already submitted" });
  }
}
