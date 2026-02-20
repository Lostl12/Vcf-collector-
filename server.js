const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const TARGET = 500;
const FILE = path.join(__dirname, "contacts_backup.json");

// memory storage
let contacts = [];

// load backup if exists
if (fs.existsSync(FILE)) {
  try {
    contacts = JSON.parse(fs.readFileSync(FILE));
  } catch {
    contacts = [];
  }
}

// save backup
function backup() {
  fs.writeFileSync(FILE, JSON.stringify(contacts, null, 2));
}

// save number
app.post("/save", (req, res) => {
  let number = req.body.number;

  if (!number) {
    return res.json({ success: false });
  }

  number = number.trim();

  if (contacts.includes(number)) {
    return res.json({
      success: false,
      duplicate: true,
      count: contacts.length,
      remaining: TARGET - contacts.length
    });
  }

  contacts.push(number);
  backup();

  res.json({
    success: true,
    count: contacts.length,
    remaining: TARGET - contacts.length
  });
});

// stats
app.get("/stats", (req, res) => {
  res.json({
    count: contacts.length,
    remaining: TARGET - contacts.length
  });
});

app.listen(3000, () => console.log("Server running"));
