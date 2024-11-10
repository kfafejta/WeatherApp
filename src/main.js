import { changeBackground } from "./modules/BackgroundManager";
import { initializeCities, loadCities } from "./modules/CityManager";
import { getUserLocation } from "./modules/WeatherManager";

initializeCities();

document
  .getElementById("city-input")
  .addEventListener("input", (e) => loadCities(e.target.value.toLowerCase()));
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
