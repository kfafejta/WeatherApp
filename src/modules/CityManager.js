import { CITY_JSON_PATH } from "../config";
import { selectCity } from "./WeatherManager";

let cities = [];

export function loadCities(inputValue) {
  if (cities.length === 0) {
    fetch(CITY_JSON_PATH)
      .then((response) => response.json())
      .then((data) => {
        cities = data;
        filterCities(inputValue);
      })
      .catch((error) => console.error("Chyba při načítání měst:", error));
  } else {
    filterCities(inputValue);
  }
}

function filterCities(inputValue) {
  const filteredCities = cities.filter((city) => city.name.toLowerCase().includes(inputValue.toLowerCase()));
  const suggestions = document.getElementById("suggestions");
  suggestions.innerHTML = "";

  filteredCities.forEach((city) => {
    const li = document.createElement("li");
    li.textContent = city.name;
    li.addEventListener("click", () => selectCity(city.name));
    suggestions.appendChild(li);
  });
}
