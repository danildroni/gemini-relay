export default async function handler(req, res) {
  const body = req.body || {};
  body.generationConfig = body.generationConfig || {};
  const model = body.model || "gemini-3.5-flash-lite";
  delete body.model;
  const url = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent";
  const payload = JSON.stringify(body);

  const keys = [];
  if (process.env.GEMINI_KEY) keys.push(process.env.GEMINI_KEY);
  if (process.env.GEMINI_KEY2) keys.push(process.env.GEMINI_KEY2);
  console.log("pupsik keys loaded:", keys.length);

  let lastStatus = 0, lastText = "";
  for (let i = 0; i < keys.length; i++) {
    let r;
    try {
      r = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": keys[i] },
        body: payload
      });
    } catch (e) {
      console.log("pupsik key", i, "fetch threw:", String(e));
      lastStatus = 500;
      lastText = JSON.stringify({ error: { message: "fetch failed: " + String(e) } });
      continue;
    }
    const t = await r.text();
    lastStatus = r.status; lastText = t;
    if (r.status === 429 && i + 1 < keys.length) {
      console.log("pupsik key", i, "429 -> rotating to", i + 1);
      continue;
    }
    console.log("pupsik used key", i, "status", r.status);
    res.status(r.status)
       .setHeader("Content-Type", "application/json")
       .setHeader("x-pupsik-key", String(i))
       .send(t);
       return;
  }
  console.log("pupsik ALL KEYS EXHAUSTED, status", lastStatus);
  res.status(lastStatus)
     .setHeader("Content-Type", "application/json")
     .setHeader("x-pupsik-key", "exhausted")
     .send(lastText);
}
