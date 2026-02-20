const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

const FILE_PATH = path.join(__dirname, "db", "contacts.json");
const TARGET = 500;

// ensure file exists
if (!fs.existsSync(FILE_PATH)) {
  fs.writeFileSync(FILE_PATH, "[]");
}

// read contacts
function readContacts() {
  const data = fs.readFileSync(FILE_PATH);
  return JSON.parse(data);
}

// save contacts
function saveContacts(data) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
}

// save number
app.post("/save", (req, res) => {
  const { number } = req.body;

  if (!number) {
    return res.json({ success: false, msg: "No number" });
  }

  let contacts = readContacts();

  // remove spaces
  const cleanNumber = number.trim();

  // prevent duplicate
  if (contacts.includes(cleanNumber)) {
    return res.json({
      success: false,
      msg: "Duplicate",
      count: contacts.length,
      remaining: TARGET - contacts.length
    });
  }

  contacts.push(cleanNumber);
  saveContacts(contacts);

  res.json({
    success: true,
    count: contacts.length,
    remaining: TARGET - contacts.length
  });
});

// stats route
app.get("/stats", (req, res) => {
  const contacts = readContacts();
  res.json({
    count: contacts.length,
    remaining: TARGET - contacts.length
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on", PORT));
