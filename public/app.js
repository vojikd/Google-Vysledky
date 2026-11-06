const form = document.querySelector("#search-form");
const input = document.querySelector("#query");
const resultsEl = document.querySelector("#results");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const query = input.value.trim();
  if (!query) {
    return;
  }

  resultsEl.textContent = "Hledám…";

  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();

    if (!response.ok) {
      resultsEl.textContent = data.error;
      return;
    }

    showResults(data.results);
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
