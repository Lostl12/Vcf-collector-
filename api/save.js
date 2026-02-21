let contacts = [];

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, number } = req.body;

  if (!name || !number) {
    return res.json({ status: "error" });
  }

  const exists = contacts.find(c => c.number === number);

  if (exists) {
    return res.json({ status: "duplicate" });
  }

  contacts.push({ name, number });

  res.json({ status: "ok" });
}
