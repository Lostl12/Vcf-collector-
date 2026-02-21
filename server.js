const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;
const CONTACTS_FILE = path.join(__dirname, "contacts.json");
const TARGET = 500;
const GROUP_LINK = "https://chat.whatsapp.com/EKu6hh1WG7Y3OdCy6IZrwg?mode=gi_t";

// Middleware
app.use(bodyParser.json());
app.use(express.static("public"));

// Helper functions
function readContacts() {
  if (!fs.existsSync(CONTACTS_FILE)) return [];
  const data = fs.readFileSync(CONTACTS_FILE, "utf8");
  return JSON.parse(data || "[]");
}

function saveContacts(list) {
  fs.writeFileSync(CONTACTS_FILE, JSON.stringify(list, null, 2));
}

// Routes
app.post("/api/save", (req, res) => {
  const { name, number } = req.body;
  if (!name || !number) return res.json({ status: "error" });

  const contacts = readContacts();
  const exists = contacts.find(c => c.number === number);

  if (exists) return res.json({ status: "duplicate" });

  contacts.push({ name, number, date: new Date().toISOString() });
  saveContacts(contacts);

  res.json({ status: "ok", count: contacts.length });
});

app.get("/api/stats", (req, res) => {
  const contacts = readContacts();
  res.json({ count: contacts.length, remaining: Math.max(TARGET - contacts.length, 0) });
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
