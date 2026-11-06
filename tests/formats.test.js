import { describe, it, expect } from "vitest";
import { toJson, toCsv } from "../public/formats.js";

const results = [
  { position: 1, title: "První", link: "https://prvni.cz", snippet: "Popis 1" },
  { position: 2, title: "Druhý", link: "https://druhy.cz", snippet: "Popis 2" },
];

describe("toJson", () => {
  it("vrátí platný JSON, který jde načíst zpět na stejná data", () => {
    expect(JSON.parse(toJson(results))).toEqual(results);
  });
});

describe("toCsv", () => {
  it("vytvoří hlavičku a jeden řádek na výsledek", () => {
    expect(toCsv(results)).toBe(
      '"position","title","link","snippet"\n' +
        '"1","První","https://prvni.cz","Popis 1"\n' +
        '"2","Druhý","https://druhy.cz","Popis 2"'
    );
  });

  it("nerozbije se na čárkách a zdvojí uvozovky uvnitř hodnot", () => {
    const tricky = [
      { position: 1, title: 'Kola "levně"', link: "https://a.cz", snippet: "Horská, silniční, gravel" },
    ];

    expect(toCsv(tricky)).toBe(
      '"position","title","link","snippet"\n' +
        '"1","Kola ""levně""","https://a.cz","Horská, silniční, gravel"'
    );
  });

  it("pro prázdné výsledky vrátí jen hlavičku", () => {
    expect(toCsv([])).toBe('"position","title","link","snippet"');
  });
});
