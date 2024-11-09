import { changeBackground } from "./modules/BackgroundManager";
import { loadCities } from "./modules/CityManager";
import { getUserLocation } from "./modules/WeatherManager";

document.getElementById("city-input").addEventListener("input", (e) => loadCities(e.target.value.toLowerCase()));
document.querySelector(".location-icon").addEventListener("click", getUserLocation);

// Testovací výběr pro změnu pozadí (pro účely testování)
document.getElementById("background-test").addEventListener("change", (event) => {
  const iconCode = event.target.value;
  if (iconCode) {
    changeBackground(iconCode);
  }
});
