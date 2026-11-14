export default async function handler(req, res) {
  const body = req.body || {};
  body.generationConfig = body.generationConfig || {};
  body.generationConfig.thinkingConfig = { thinkingLevel: "minimal" };
  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent";
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_KEY },
    body: JSON.stringify(body)
  });
  const t = await r.text();
  res.status(r.status).setHeader("Content-Type", "application/json").send(t);
}
