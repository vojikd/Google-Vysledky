import { describe, it, expect } from "vitest";
import { extractOrganicResults } from "../src/results.js";

describe("extractOrganicResults", () => {
  it("vrátí jen organické výsledky a ignoruje ostatní části odpovědi", () => {
    const serperData = {
      knowledgeGraph: { title: "Nějaká firma" },
      organic: [
        { title: "První", link: "https://prvni.cz", snippet: "Popis 1", position: 1 },
        { title: "Druhý", link: "https://druhy.cz", snippet: "Popis 2", position: 2 },
      ],
      peopleAlsoAsk: [{ question: "Otázka?" }],
    };

    expect(extractOrganicResults(serperData)).toEqual([
      { position: 1, title: "První", link: "https://prvni.cz", snippet: "Popis 1" },
      { position: 2, title: "Druhý", link: "https://druhy.cz", snippet: "Popis 2" },
    ]);
  });

  it("odstraní pole navíc (např. sitelinks)", () => {
    const serperData = {
      organic: [
        { title: "A", link: "https://a.cz", snippet: "S", position: 1, sitelinks: [{ title: "x" }] },
      ],
    };

    expect(extractOrganicResults(serperData)).toEqual([
      { position: 1, title: "A", link: "https://a.cz", snippet: "S" },
    ]);
  });

  it("doplní chybějící popisek a pozici", () => {
    const serperData = { organic: [{ title: "A", link: "https://a.cz" }] };

    expect(extractOrganicResults(serperData)).toEqual([
      { position: 1, title: "A", link: "https://a.cz", snippet: "" },
    ]);
  });

  it("vrátí prázdné pole, když organické výsledky chybí", () => {
    expect(extractOrganicResults({})).toEqual([]);
    expect(extractOrganicResults(undefined)).toEqual([]);
  });
});
