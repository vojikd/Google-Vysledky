// Z odpovědi Serper.dev vybere jen organické (přirozené) výsledky
// a každý převede na jednotný tvar: { position, title, link, snippet }.
export function extractOrganicResults(serperData) {
  const organic = serperData?.organic ?? [];

  return organic.map((item, index) => ({
    position: item.position ?? index + 1,
    title: item.title ?? "",
    link: item.link ?? "",
    snippet: item.snippet ?? "",
  }));
}
