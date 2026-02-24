async function loadCount() {
  const res = await fetch("/count")
  const data = await res.json()
  document.getElementById("count").innerText = data.count
}

async function save() {
  const number = document.getElementById("number").value

  const res = await fetch("/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ number })
  })

  const data = await res.json()
  document.getElementById("msg").innerText = data.msg

  if (data.count !== undefined) {
    document.getElementById("count").innerText = data.count
  }
}

loadCount()
