import express from "express";
import path from "node:path";

const app = express();
const PORT = process.env.PORT || 3000;

// Soubory ze složky "public" posíláme prohlížeči tak, jak jsou.
// Na adrese "/" se automaticky zobrazí public/index.html.
app.use(express.static(path.join(import.meta.dirname, "public")));

app.listen(PORT, () => {
  console.log(`Server běží na http://localhost:${PORT}`);
});
