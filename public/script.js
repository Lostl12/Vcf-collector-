const TARGET = 500;
const GROUP_LINK = "https://chat.whatsapp.com/YOUR_LINK_HERE";

async function loadStats() {
  const res = await fetch("/api/stats");
  const data = await res.json();

  document.getElementById("contacts").innerText = data.count;
  document.getElementById("remaining").innerText = TARGET - data.count;

  const percent = (data.count / TARGET) * 100;
  document.getElementById("bar").style.width = percent + "%";

  if (data.count >= TARGET) {
    document.getElementById("downloadBtn").style.display = "block";
    document.getElementById("downloadBtn").onclick = () => {
      window.location = GROUP_LINK;
    };
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
    alert("Success! Redirecting...");
    window.location = GROUP_LINK;
  }

  loadStats();
}

loadStats();
