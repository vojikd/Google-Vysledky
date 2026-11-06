import { toJson, toCsv } from "./formats.js";

const form = document.querySelector("#search-form");
const input = document.querySelector("#query");
const resultsEl = document.querySelector("#results");
const downloadsEl = document.querySelector("#downloads");

// Poslední úspěšně nalezené výsledky. Z nich se vytvoří soubory ke stažení.
let currentQuery = "";
let currentResults = [];



form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const query = input.value.trim();
  if (!query) {
    return;
  }

  resultsEl.textContent = "Hledám…";
  downloadsEl.hidden = true;


  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();

    if (!response.ok) {
      resultsEl.textContent = data.error;
      return;
    }

    currentQuery = data.query;
    currentResults = data.results;
    showResults(data.results);
    downloadsEl.hidden = data.results.length === 0;
  } catch (error) {
    resultsEl.textContent = "Nepodařilo se spojit se serverem.";
  }
});

// Vypíše výsledky jako číslovaný seznam: odkaz s titulkem a pod ním popisek.
function showResults(results) {
  resultsEl.textContent = "";

  if (results.length === 0) {
    resultsEl.textContent = "Nebyly nalezeny žádné výsledky.";
    return;
  }

  const list = document.createElement("ol");

  for (const result of results) {
    const item = document.createElement("li");

    const link = document.createElement("a");
    link.href = result.link;
    link.textContent = result.title;

    const snippet = document.createElement("p");
    snippet.textContent = result.snippet;

    item.append(link, snippet);
    list.append(item);
  }

  resultsEl.append(list);
}

// Nabídne prohlížeči text ke stažení jako soubor.
function downloadFile(content, fileName, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(url);
}

document.querySelector("#download-json").addEventListener("click", () => {
  downloadFile(toJson(currentResults), `vysledky-${currentQuery}.json`, "application/json");
});

document.querySelector("#download-csv").addEventListener("click", () => {
  // "\uFEFF" (BOM) na začátku: Excel díky němu správně zobrazí češtinu.
  downloadFile("\uFEFF" + toCsv(currentResults), `vysledky-${currentQuery}.csv`, "text/csv;charset=utf-8");
});

