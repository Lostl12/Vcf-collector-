import express from "express";
import fs from "fs-extra";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

const DB = "contacts.json";
const TARGET = 500; // target is now 500 contacts

// ensure contacts.json exists
await fs.ensureFile(DB);

// read contacts
async function getContacts() {
  try {
    return await fs.readJson(DB);
  } catch {
    return [];
  }
}

// save submission
app.post("/save", async (req, res) => {
  const { name, phone } = req.body;
  if (!name || !phone) return res.json({ error: "Missing data" });

  const contacts = await getContacts();
  contacts.push({ name, phone });
  await fs.writeJson(DB, contacts, { spaces: 2 });

  const percent = Math.min(100, Math.floor((contacts.length / TARGET) * 100));

  res.json({
    count: contacts.length,
    target: TARGET,
    ready: contacts.length >= TARGET,
    progress: percent
  });
});

// serve VCF download
app.get("/download", async (req, res) => {
  const contacts = await getContacts();
  if (contacts.length < TARGET) {
    return res.send("Target not reached yet");
  }

  let vcf = "";
  contacts.forEach(c => {
    vcf += `BEGIN:VCARD
VERSION:3.0
FN:${c.name}
TEL:${c.phone}
END:VCARD
`;
  });

  res.setHeader("Content-Type", "text/vcard");
  res.setHeader("Content-Disposition", "attachment; filename=contacts.vcf");
  res.send(vcf);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
