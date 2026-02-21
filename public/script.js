async function loadStats() {
  const res = await fetch("/api/stats");
  const data = await res.json();

  document.getElementById("contacts").innerText = data.contacts;
  document.getElementById("remaining").innerText = data.remaining;

  const percent = (data.contacts / 500) * 100;
  document.getElementById("bar").style.width = percent + "%";

  if (data.remaining === 0) {
    document.getElementById("downloadBtn").style.display = "block";
  }
}

async function submitContact() {
  const name = document.getElementById("name").value;
  const number = document.getElementById("number").value;

  const res = await fetch("/api/save", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ name, number })
  });

  const data = await res.json();

  if (data.success) {
    loadStats();
    document.getElementById("name").value = "";
    document.getElementById("number").value = "";
  } else {
    alert(data.message);
  }
}

loadStats();
