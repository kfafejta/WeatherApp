import { API_KEY } from "../config";
import { displayForecast } from "./ForecastDisplay";
import { displayTemperatureChart } from "./TemperatureChart";
import { changeBackground } from "./BackgroundManager";

// Výběr města a zobrazení předpovědi
export function selectCity(city) {
  document.getElementById("city-input").value = city;
  document.getElementById("suggestions").innerHTML = "";
  getWeatherForecast(city);
}

// Načtení předpovědi počasí podle názvu města
export function getWeatherForecast(city) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
  )
    .then((response) =>
      response.ok
        ? response.json()
        : Promise.reject("Chyba při načítání dat o počasí")
    )
    .then(handleWeatherData)
    .catch((error) => console.error("Chyba při načítání předpovědi:", error));
}

// Získání předpovědi počasí podle aktuální polohy uživatele
export function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) =>
        fetchWeatherByCoordinates(
          position.coords.latitude,
          position.coords.longitude
        ),
      handleLocationError
    );
  } else {
    alert("Geolokace není podporována vaším prohlížečem.");
  }
}

// Načtení předpovědi počasí podle zeměpisné šířky a délky
function fetchWeatherByCoordinates(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  )
    .then((response) =>
      response.ok
        ? response.json()
        : Promise.reject("Chyba při načítání dat o počasí")
    )
    .then(handleWeatherData)
    .catch((error) => console.error("Chyba při načítání předpovědi:", error));
}

// Zpracování a zobrazení načtených dat o počasí
function handleWeatherData(data) {
  if (data && data.city) {
    document.getElementById(
      "city-name"
    ).textContent = `Počasí: ${data.city.name}`;
    displayForecast(data);

    // Automaticky vybrat první den při načtení
    const firstDay = data.list[0].dt_txt.split(" ")[0];
    displayTemperatureChart(data, firstDay);
    const firstDayIcon = data.list[0].weather[0].icon;
    changeBackground(firstDayIcon);
  } else {
    console.error("Data o městě nejsou k dispozici.");
  }
}

// Ošetření chyb při získávání polohy
function handleLocationError(error) {
  const errors = {
    [error.PERMISSION_DENIED]: "Přístup k poloze byl zamítnut.",
    [error.POSITION_UNAVAILABLE]: "Informace o poloze nejsou k dispozici.",
    [error.TIMEOUT]: "Žádost o získání polohy vypršela.",
  };
  alert(errors[error.code] || "Došlo k neznámé chybě.");
}
