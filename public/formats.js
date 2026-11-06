// Převod výsledků do formátů ke stažení.
// Používá ho prohlížeč (app.js) i unit testy.

const CSV_COLUMNS = ["position", "title", "link", "snippet"];

// JSON s odsazením 2 mezery, aby byl čitelný i pro člověka.
export function toJson(results) {
  return JSON.stringify(results, null, 2);
}

// Obalí hodnotu uvozovkami a zdvojí uvozovky uvnitř (pravidlo CSV).
function csvValue(value) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

// CSV: první řádek názvy sloupců, pak jeden řádek na výsledek.
export function toCsv(results) {
  const header = CSV_COLUMNS.map(csvValue).join(",");
  const rows = results.map((result) =>
    CSV_COLUMNS.map((column) => csvValue(result[column])).join(",")
  );
  return [header, ...rows].join("\n");
}
