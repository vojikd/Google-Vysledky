# Základ: oficiální image s Node.js 22 (varianta alpine = malá a rychlá)
FROM node:22-alpine

# Pracovní složka uvnitř kontejneru
WORKDIR /app

# Nejdřív jen seznam závislostí a jejich instalace
COPY package.json package-lock.json ./
RUN npm ci

# Pak zbytek kódu
COPY . .

# Aplikace poslouchá na portu 3000
EXPOSE 3000

# Výchozí příkaz při spuštění kontejneru
CMD ["npm", "start"]
