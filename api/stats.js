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
  number: String
});

const Contact = mongoose.models.Contact || mongoose.model("Contact", ContactSchema);

export default async function handler(req, res) {
  await connectDB();

  const count = await Contact.countDocuments();
  const target = 500;

  res.json({
    target,
    contacts: count,
    remaining: target - count
  });
}
