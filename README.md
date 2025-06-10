# BP - Aplikace Záchranka pro tlačítkový telefon

## ⚠️ tato aplikace není oficiální verzí aplikace Záchranka pro KaiOS a není napojená na její rozhraní, nekontaktujte skrze tuto aplikaci integrované záchranné složky ⚠️
### ⚠️ this app is not an official KaiOS application for Záchranka and is not connected to the appropriate infrastructure, do not attempt contacting emergency services using this app ⚠️

## spuštění a instalace projektu

`npm i` - instalace závislostí specifikovaných v souboru package.json

`npm run build` - sestavení kódu do složky `\public\build` - sestavený kód je poté možné nahrát do zařízení výběrem složky `\public` ve WebIDE

`npm run dev` - spuštění vývojového prostředí - při vývoji nebylo používáno, vždy je třeba testovat na reálném zařízení

## struktura projektu

- `\public`
  - `\static` - ikony
  - `global.css` - globální styly
  - `index.html` - tělo webové aplikace
  - `manifest.webapp` - nastavení aplikace určené pro KaiOS
- `\src` - zdrojový kód aplikace
  - `\components` - komponenty
  - `\constants` - konstanty
  - `\data` - třídy spravující nakládání s daty
  - `\routes` - jednotlivé obrazovky
  - `\utils` - skripty a funkce 
  - `App.svelte` - hlavní obrazovka aplikace
  - `main.ts` - hlavní vstupní bod aplikace
- `babel.config.json`
- `package-lock.json`
- `package.json`
- `rollup.config.js`
- `tsconfig.json`