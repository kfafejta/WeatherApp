import { changeBackground } from "./modules/BackgroundManager";
import { initializeCities, loadCities } from "./modules/CityManager";
import { getUserLocation } from "./modules/WeatherManager";

// Inicializace měst při spuštění aplikace
initializeCities();

// Načítání návrhů měst na základě uživatelského vstupu
document
  .getElementById("city-input")
  .addEventListener("input", (e) => loadCities(e.target.value.toLowerCase()));
// Při kliknutí na ikonu lokace získá aktuální polohu uživatele
document
  .querySelector(".location-icon")
  .addEventListener("click", getUserLocation);

// Testovací výběr pro změnu pozadí (pro účely testování)
document
  .getElementById("background-test")
  .addEventListener("change", (event) => {
    const iconCode = event.target.value;
    if (iconCode) {
      changeBackground(iconCode);
    }
  });
