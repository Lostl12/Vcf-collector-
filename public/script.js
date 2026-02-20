const TARGET = 500;

async function getStats() {
  const res = await fetch("/api/stats");
  return await res.json();
}

async function updateUI() {
  const stats = await getStats();
  document.getElementById("target").innerText = stats.target;
  document.getElementById("count").innerText = stats.contacts;
  document.getElementById("remaining").innerText = stats.remaining;

  const percent = (stats.contacts / stats.target) * 100;
  document.getElementById("progress").style.background =
    `conic-gradient(#4caf50 0% ${percent}%, transparent ${percent}% 100%)`;

  if (stats.contacts >= stats.target) {
    document.getElementById("downloadBtn").style.display = "block";
  }
}

async function submitContact() {
  const number = document.getElementById("numberInput").value.trim();
  if (!number) return alert("Enter number");

  const res = await fetch("/api/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ number })
  });

  const data = await res.json();

  if (data.success) {
    alert("Contact submitted successfully");
    setTimeout(() => {
      window.location.href = "https://chat.whatsapp.com/EKu6hh1WG7Y3OdCy6IZrwg";
    }, 1500);
  } else {
    alert(data.message || "Failed to submit contact");
  }

  updateUI();
}

// update counts on page load
updateUI();
