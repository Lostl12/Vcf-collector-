let contacts = global.contacts || [];
global.contacts = contacts;

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, number } = req.body;

  if (!name || !number) {
    return res.json({ success: false, message: "Fill all fields" });
  }

  const exists = contacts.find(c => c.number === number);

  if (exists) {
    return res.json({ success: false, message: "Number already registered" });
  }

  contacts.push({ name, number });

  return res.json({ success: true });
}
