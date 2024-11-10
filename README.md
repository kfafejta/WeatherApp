# Předpověď Počasí

Aplikace zobrazuje aktuální předpověď počasí a umožňuje uživatelům zobrazit teplotu formou grafu. Využívá OpenWeatherMap API pro získání předpovědi počasí a nabízí možnost vyhledání podle zadaného města nebo aktuální polohy uživatele.

## Funkce aplikace

- Vyhledávání a zobrazení počasí podle města.
- Získání předpovědi počasí podle aktuální polohy.
- Zobrazení grafu teploty pro konkrétní den.
- Automatická změna pozadí na základě aktuálního počasí.

## Spuštění aplikace

### Požadavky

- [Node.js](https://nodejs.org/) ve verzi 12 nebo vyšší.
- [Vite](https://vitejs.dev/) pro rychlý vývojový server.

### Instalace a spuštění

1. Naklonujte tento repozitář:

   ```bash
   git clone https://github.com/kfafejta/WeatherApp.git
   cd repository
   ```

2. Nainstalujte závislosti:

   ```bash
   npm install
   ```

3. Spusťte vývojový server:

   ```bash
   npm run dev
   ```

4. Otevřete aplikaci v prohlížeči na adrese: [http://localhost:5173](http://localhost:5173) (port se může lišit podle konfigurace).

### Podporované prohlížeče

Aplikace byla testována a funguje v následujících prohlížečích:

- Google Chrome (nejnovější verze)
- Mozilla Firefox (nejnovější verze)
- Microsoft Edge (nejnovější verze)
- Safari (nejnovější verze)

## Struktura projektu

Projekt je rozdělen do několika modulů a složek pro snadnou správu a čitelnost kódu.

### Struktura složek

```
Weather-app/
├── public/
│   ├── city.list.json           // JSON soubor se seznamem měst
│   └── img/                     // Obrázky pro pozadí dle počasí
│       ├── bourka.jpg
│       ├── dest.jpg
│       ├── slunecno.jpg
│       └── ...                  // Další obrázky
├── src/
│   ├── main.js                  // Hlavní vstupní bod aplikace
│   ├── config.js                // Konfigurace, API klíče a cesty
│   ├── index.html               // HTML struktura s elementy
│   ├── modules/                 // Moduly pro jednotlivé funkce
│   │   ├── BackgroundManager.js // Modul pro správu pozadí
│   │   ├── CityManager.js       // Modul pro správu měst
│   │   ├── WeatherManager.js    // Modul pro správu dat o počasí
│   │   ├── ForecastDisplay.js   // Modul pro zobrazení předpovědi
│   │   └── TemperatureChart.js  // Modul pro graf teplot
│   ├── styles/
│   │   └── style.css             // Hlavní styly aplikace
└── vite.config.js               // Konfigurace Vite.js
```

### Popis modulů

- **main.js** - Hlavní vstupní bod aplikace, kde jsou inicializovány jednotlivé funkce pro načítání měst, získání počasí podle polohy a zobrazení předpovědi.
- **config.js** - Obsahuje klíč API a cestu k JSON souboru se seznamem měst.
- **BackgroundManager.js** - Modul pro správu pozadí aplikace. Na základě ikony aktuálního počasí mění pozadí aplikace.
- **CityManager.js** - Modul pro načítání a filtrování měst. Načítá data ze souboru `city.list.json` a zobrazuje návrhy měst podle uživatelského vstupu.
- **WeatherManager.js** - Modul pro správu dat o počasí. Umožňuje získat předpověď na základě názvu města nebo polohy uživatele, zpracovává data o počasí a spravuje případné chyby při načítání.
- **ForecastDisplay.js** - Modul pro zobrazení předpovědi počasí. Generuje seznam předpovědí pro nadcházející dny a umožňuje interakci pro změnu zobrazeného grafu teplot.
- **TemperatureChart.js** - Modul pro graf teplot. Používá knihovnu Chart.js pro vizualizaci teploty po hodinách v průběhu dne.

## Závěr

Tato aplikace poskytuje snadno použitelné rozhraní pro zobrazení předpovědi počasí a je optimalizována pro rychlý vývoj a údržbu. Díky modularitě kódu je možné snadno přidávat nové funkce a udržovat čistý a přehledný kód.
