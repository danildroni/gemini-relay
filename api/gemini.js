export default async function handler(req, res) {
  const body = req.body || {};
  body.generationConfig = body.generationConfig || {};
  const url = "https://generativelanguage.googleapis.com/v1beta/models/" + (body.model || "gemini-3.5-flash-lite") + ":generateContent";
  delete body.model;
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_KEY },
    body: JSON.stringify(body)
  });
  const t = await r.text();
  res.status(r.status).setHeader("Content-Type", "application/json").send(t);
}
