let contacts = global.contacts || [];
global.contacts = contacts;

const TARGET = 500;

export default function handler(req, res) {
  const total = contacts.length;

  res.json({
    contacts: total,
    remaining: Math.max(TARGET - total, 0)
  });
}
