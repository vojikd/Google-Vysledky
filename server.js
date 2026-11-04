import express from "express";
import path from "node:path";
import { fetchSerperResults } from "./src/serper.js";
import { extractOrganicResults } from "./src/results.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Soubory ze složky "public" posíláme prohlížeči tak, jak jsou.
// Na adrese "/" se automaticky zobrazí public/index.html.
app.use(express.static(path.join(import.meta.dirname, "public")));

// API: vrátí organické výsledky z 1. strany Googlu pro zadanou frázi.
// Příklad: GET /api/search?q=kola
app.get("/api/search", async (req, res) => {
  const query = String(req.query.q ?? "").trim();

  if (!query) {
    return res.status(400).json({ error: "Zadejte klíčovou frázi." });
  }

  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Na serveru chybí API klíč." });
  }

  try {
    const serperData = await fetchSerperResults(query, apiKey);
    const results = extractOrganicResults(serperData);
    res.json({ query, results });
  } catch (error) {
    console.error(error);
    res.status(502).json({ error: "Nepodařilo se získat výsledky z Googlu." });
  }
});

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Server běží na http://localhost:${PORT}`);
});
