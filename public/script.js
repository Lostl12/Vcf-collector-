const TARGET = 500;
const GROUP_LINK = "https://chat.whatsapp.com/EKu6hh1WG7Y3OdCy6IZrwg?mode=gi_t";

async function loadStats() {
  const res = await fetch("/api/stats");
  const data = await res.json();

  document.getElementById("contacts").innerText = data.count;
  document.getElementById("remaining").innerText = data.remaining;

  const percent = (data.count / TARGET) * 360;
  document.getElementById("circle").style.background =
    `conic-gradient(#00ff88 ${percent}deg, #222 ${percent}deg)`;

  if (data.count >= TARGET) {
    const btn = document.getElementById("downloadBtn");
    btn.style.display = "block";
    btn.onclick = () => window.location = GROUP_LINK;
  }
}

async function submitContact() {
  const name = document.getElementById("name").value.trim();
  const number = document.getElementById("number").value.trim();

  if (!name || !number) {
    alert("Enter name and number");
    return;
  }

  const res = await fetch("/api/save", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ name, number })
  });

  const data = await res.json();

  if (data.status === "duplicate") {
    alert("Number already registered");
    return;
  }

  if (data.status === "ok") {
    alert("Success! Redirecting to WhatsApp...");
    window.location = GROUP_LINK;
  }

  loadStats();
}

loadStats();
