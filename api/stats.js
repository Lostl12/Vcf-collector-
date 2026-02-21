import save from "./save";

export default function handler(req, res) {
  const contacts = save.contacts || [];
  res.json({ count: contacts.length });
}
