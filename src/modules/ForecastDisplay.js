import { changeBackground } from "./BackgroundManager";
import { displayTemperatureChart } from "./TemperatureChart";

// Funkce pro zobrazení předpovědi počasí
export function displayForecast(data) {
  const forecastList = document.getElementById("forecast-list");
  forecastList.innerHTML = "";

  // Získá seznam dnů z předpovědních dat a omezí výběr na maximálně 7 dní
  const uniqueDays = Array.from(
    new Set(data.list.map((item) => item.dt_txt.split(" ")[0]))
  ).slice(0, 7);

  // Pro každý jednotlivý den z dat
  uniqueDays.forEach((date) => {
    // Najde data odpovídající 12:00 daného dne
    const dayData = data.list.find(
      (item) => item.dt_txt.startsWith(date) && item.dt_txt.includes("12:00:00")
    );
    if (dayData) {
      // Získá zkrácený název v českém formátu
      const dayName = new Date(dayData.dt_txt).toLocaleDateString("cs-CZ", {
        weekday: "short",
      });
      // Získá a zaokrouhlí teplotu na jedno desetinné místo
      const temp = dayData.main.temp.toFixed(1);
      // Získá kód ikony počasí
      const iconCode = dayData.weather[0].icon;
      // Vytvoří URL pro obrázek ikony počasí
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

      // Vytvoří nový prvek seznamu (li) pro zobrazení dne předpovědi
      const listItem = document.createElement("li");
      listItem.innerHTML = `
        <span class="forecast-day">${dayName}</span>
        <img class="forecast-icon" src="${iconUrl}" alt="${dayData.weather[0].description}">
        <span class="forecast-temp">${temp}°</span>
      `;
      listItem.addEventListener("click", () => {
        displayTemperatureChart(data, date);
        changeBackground(iconCode);
      });
      forecastList.appendChild(listItem);
    }
  });
}
