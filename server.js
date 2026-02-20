import express from "express";
import sqlite3 from "sqlite3";
import path from "path";

const app = express();
app.use(express.json());
app.use(express.static("public"));

// SQLite setup
const dbPath = path.join(process.cwd(), "database.db");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL
  )`);
});

const TARGET = 500;

// Submit contact
app.post("/save", (req, res) => {
  const { name, phone } = req.body;
  if(!name || !phone) return res.json({ error: "Fill all fields" });

  db.get("SELECT COUNT(*) AS count FROM contacts", [], (err, row) => {
    if(err) return res.json({ error: err.message });

    if(row.count < TARGET) {
      db.run("INSERT INTO contacts (name, phone) VALUES (?, ?)", [name, phone], function(err2){
        if(err2) return res.json({ error: err2.message });

        const ready = row.count + 1 >= TARGET;
        res.json({ target: TARGET, count: row.count + 1, ready });
      });
    } else {
      res.json({ target: TARGET, count: row.count, ready: true });
    }
  });
});

// Get current count (for circle/progress)
app.get("/count", (req, res) => {
  db.get("SELECT COUNT(*) AS count FROM contacts", [], (err, row) => {
    if(err) return res.json({ error: err.message });
    res.json({ target: TARGET, count: row.count, ready: row.count >= TARGET });
  });
});

// Download VCF
app.get("/download", (req, res) => {
  db.all("SELECT * FROM contacts", [], (err, rows) => {
    if(err) return res.send("Error fetching contacts");

    let vcf = "";
    rows.forEach(c => {
      vcf += `BEGIN:VCARD\nVERSION:3.0\nFN:${c.name}\nTEL:${c.phone}\nEND:VCARD\n`;
    });

    res.setHeader("Content-Type", "text/vcard");
    res.setHeader("Content-Disposition", "attachment; filename=contacts.vcf");
    res.send(vcf);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
