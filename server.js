// server.js
import express from "express";
import fs from "fs";
import path from "path";

const app = express();
app.use(express.json());
app.use(express.static("public")); // serve HTML page

const TARGET = 500;
const DATA_FILE = path.join(process.cwd(), "contacts.json");

// Helper: read contacts
function readContacts() {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Helper: save contacts
function saveContacts(list) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2));
}

// Save contact
app.post("/save", (req, res) => {
  const { name, phone } = req.body;
  if(!name || !phone) return res.json({ error: "Fill all fields" });

  let contacts = readContacts();

  if(contacts.length < TARGET) {
    contacts.push({ name, phone });
    saveContacts(contacts);
  }

  const ready = contacts.length >= TARGET;

  // Always return target & count to frontend
  res.json({ target: TARGET, count: contacts.length, ready });
});

// Download VCF
app.get("/download", (req, res) => {
  const contacts = readContacts();
  let vcf = "";
  contacts.forEach(c => {
    vcf += `BEGIN:VCARD\nVERSION:3.0\nFN:${c.name}\nTEL:${c.phone}\nEND:VCARD\n`;
  });
  res.setHeader("Content-Type", "text/vcard");
  res.setHeader("Content-Disposition", "attachment; filename=contacts.vcf");
  res.send(vcf);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
