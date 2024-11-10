import { CITY_JSON_PATH } from "../config";
import { selectCity } from "./WeatherManager";

let cities = [];

// Načtení měst ihned po spuštění aplikace
export async function initializeCities() {
  try {
    const response = await fetch(CITY_JSON_PATH);
    cities = await response.json();
  } catch (error) {
    console.error("Chyba při načítání měst:", error);
  }
}

// Filtrování měst podle vstupu uživatele
export function loadCities(inputValue) {
  if (cities.length > 0) {
    filterCities(inputValue);
  } else {
    console.warn("Města nejsou načtena.");
  }
}

// Funkce pro filtrování a zobrazení měst
function filterCities(inputValue) {
  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  const suggestions = document.getElementById("suggestions");
  suggestions.innerHTML = "";
  filteredCities.forEach((city) => {
    const li = document.createElement("li");
    li.textContent = city.name;
    li.addEventListener("click", () => selectCity(city.name));
    suggestions.appendChild(li);
  });
}
