const SERPER_URL = "https://google.serper.dev/search";

// Pošle dotaz na Serper.dev a vrátí jeho odpověď (výsledky 1. strany Googlu).
export async function fetchSerperResults(query, apiKey) {
  const response = await fetch(SERPER_URL, {
    method: "POST",
    headers: {
      "X-API-KEY": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ q: query, gl: "cz", hl: "cs" }),
  });

  if (!response.ok) {
    throw new Error(`Serper.dev vrátil chybu ${response.status}`);
  }

  return response.json();
}
