# Google výsledky

Webová aplikace, která pro zadanou klíčovou frázi stáhne **přirozené (organické) výsledky z 1. strany Googlu** a umožní je uložit jako **JSON** nebo **CSV**.

**Živá ukázka:** https://google-vysledky.onrender.com

> Aplikace běží na free tarifu Renderu. Po delší nečinnosti se uspí a první načtení může trvat až minutu.

## Jak to funguje

1. Uživatel zadá frázi na stránce a odešle formulář.
2. Frontend (`public/app.js`) zavolá náš server: `GET /api/search?q=fráze`.
3. Server (`server.js`) se zeptá služby [Serper.dev](https://serper.dev), která vrací výsledky Googlu jako JSON.
4. Z odpovědi se vyberou jen organické výsledky (`src/results.js`) ve tvaru `{ position, title, link, snippet }`.
5. Frontend výsledky vypíše a nabídne stažení jako JSON nebo CSV (`public/formats.js`).

## Technická rozhodnutí

- **Serper.dev místo přímého stahování Googlu:** Google nenabízí oficiální API na výsledky vyhledávání a přímé stahování (scraping) blokuje a porušuje jeho podmínky.
- **Vlastní server mezi prohlížečem a Serperem:** API klíč zůstává na serveru v proměnné prostředí. Kdyby se Serper volal z prohlížeče, klíč by byl viditelný pro každého.
- **Výsledky jako z Česka:** dotaz se posílá s `gl=cz` a `hl=cs`, aby odpovídal tomu, co vidí český uživatel.
- **Jen organické výsledky:** bere se pouze pole `organic`. Reklamy, „Lidé se také ptají“ ani další bloky se nevracejí.
- **Stahování v prohlížeči:** soubor se vytvoří z již zobrazených výsledků. Stáhne se přesně to, co uživatel vidí, a nespotřebuje se další dotaz na Serper.
- **CSV podle standardu:** hodnoty v uvozovkách (čárky v textu tak nerozbijí sloupce), uvozovky uvnitř zdvojené. Soubor začíná znakem BOM, aby Excel správně zobrazil češtinu.
- **Bezpečný výpis:** výsledky se vkládají přes `textContent`, ne `innerHTML`, jako ochrana proti XSS.

## Technologie

- Node.js 22+, Express 5
- HTML, CSS, JavaScript (bez frameworku)
- Vitest (unit testy)
- Render (hosting)
- Docker, Docker Compose (lokální vývoj)

## Spuštění lokálně

Potřebuješ Node.js 22 nebo novější a API klíč ze [serper.dev](https://serper.dev) (registrace zdarma).

```bash
npm install
cp .env.example .env
```

Do souboru `.env` doplň svůj klíč (`SERPER_API_KEY=...`) a spusť:

```bash
npm run dev
```

Aplikace poběží na http://localhost:3000.

## Spuštění přes Docker

Potřebuješ jen [Docker Desktop](https://www.docker.com/products/docker-desktop/), Node.js instalovat nemusíš.

```bash
cp .env.example .env
```

Do `.env` doplň API klíč a spusť:

```bash
docker compose up --build
```

Aplikace poběží na http://localhost:3000. Díky propojení složky projektu s kontejnerem se změny v kódu projeví bez restartu. Zastavení: `Ctrl+C` a `docker compose down`.


## Testy

```bash
npm test
```

Unit testy ověřují správnost výstupu:
- `tests/results.test.js`: výběr organických výsledků z odpovědi Serperu (ignorování ostatních bloků, jednotný tvar, chybějící hodnoty),
- `tests/formats.test.js`: převod do JSON a CSV (včetně čárek a uvozovek v textu).

## Struktura projektu

```
server.js            Express server a endpoint /api/search
src/serper.js        volání Serper.dev API
src/results.js       výběr organických výsledků
public/index.html    stránka s formulářem
public/app.js        hledání, výpis výsledků, stahování
public/formats.js    převod do JSON a CSV
public/style.css     vzhled
tests/               unit testy (Vitest)
```


