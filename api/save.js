let contacts = global.contacts || [];
global.contacts = contacts;

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  const { name, number } = req.body;

  if (!name || !number) {
    return res.json({
      success: false,
      message: "Missing name or number"
    });
  }

  // remove spaces
  const cleanNumber = number.replace(/\s+/g, "");

  // check duplicate
  const exists = contacts.find(c => c.number === cleanNumber);

  if (exists) {
    return res.json({
      success: false,
      message: "Number already submitted"
    });
  }

  contacts.push({
    name,
    number: cleanNumber,
    date: new Date().toISOString()
  });

  return res.json({
    success: true,
    total: contacts.length
  });
}
