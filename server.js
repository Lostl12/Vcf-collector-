const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const TARGET = 500;

const SUPABASE_URL = "https://segmoflngzygrmacwmdi.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlZ21vZmxuZ3p5Z3JtYWN3bWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1ODE1MjQsImV4cCI6MjA4NzE1NzUyNH0.fsK3dRt6qv0LUNg3kQ99w6Y2EHHtac-PZ5W52BxnBiI";

// ---------- SAVE CONTACT ----------
app.post("/save", async (req, res) => {
  let number = req.body.number?.trim();
  if (!number) return res.json({ success: false });

  try {
    // check duplicate
    const check = await fetch(
      `${SUPABASE_URL}/rest/v1/contacts?number=eq.${number}`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    const existing = await check.json();

    if (existing.length > 0) {
      const stats = await getStats();
      return res.json({
        success: false,
        duplicate: true,
        ...stats
      });
    }

    // insert new contact
    await fetch(`${SUPABASE_URL}/rest/v1/contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify({ number })
    });

    const stats = await getStats();

    res.json({
      success: true,
      ...stats
    });

  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});

// ---------- GET STATS ----------
async function getStats() {
  const r = await fetch(
    `${SUPABASE_URL}/rest/v1/contacts?select=count`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: "count=exact"
      }
    }
  );

  const total = r.headers.get("content-range").split("/")[1];

  return {
    count: Number(total),
    remaining: TARGET - Number(total)
  };
}

app.get("/stats", async (req, res) => {
  res.json(await getStats());
});

app.listen(3000, () => console.log("Server running"));
