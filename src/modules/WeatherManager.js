import { API_KEY } from "../config";
import { displayForecast } from "./ForecastDisplay";
import { displayTemperatureChart } from "./TemperatureChart";
import { changeBackground } from "./BackgroundManager";

export function selectCity(city) {
  document.getElementById("city-input").value = city;
  document.getElementById("suggestions").innerHTML = "";
  getWeatherForecast(city);
}

export function getWeatherForecast(city) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`)
    .then((response) => (response.ok ? response.json() : Promise.reject("Chyba při načítání dat o počasí")))
    .then(handleWeatherData)
    .catch((error) => console.error("Chyba při načítání předpovědi:", error));
}

export function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => fetchWeatherByCoordinates(position.coords.latitude, position.coords.longitude),
      handleLocationError
    );
  } else {
    alert("Geolokace není podporována vaším prohlížečem.");
  }
}

function fetchWeatherByCoordinates(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
    .then((response) => (response.ok ? response.json() : Promise.reject("Chyba při načítání dat o počasí")))
    .then(handleWeatherData)
    .catch((error) => console.error("Chyba při načítání předpovědi:", error));
}

function handleWeatherData(data) {
  if (data && data.city) {
    document.getElementById("city-name").textContent = `Počasí: ${data.city.name}`;
    displayForecast(data);
    displayTemperatureChart(data, new Date().toISOString().split("T")[0]);
    changeBackground(data.list[0].weather[0].icon);
  } else {
    console.error("Data o městě nejsou k dispozici.");
  }
}

function handleLocationError(error) {
  const errors = {
    [error.PERMISSION_DENIED]: "Přístup k poloze byl zamítnut.",
    [error.POSITION_UNAVAILABLE]: "Informace o poloze nejsou k dispozici.",
    [error.TIMEOUT]: "Žádost o získání polohy vypršela.",
  };
  alert(errors[error.code] || "Došlo k neznámé chybě.");
}
