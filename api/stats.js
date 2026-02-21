let contacts = global.contacts || [];
global.contacts = contacts;

export default function handler(req, res) {
  const target = 500;
  const count = contacts.length;
  const remaining = target - count;

  res.json({
    contacts: count,
    remaining: remaining > 0 ? remaining : 0
  });
}
