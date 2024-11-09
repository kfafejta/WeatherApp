import { changeBackground } from "./BackgroundManager";
import { displayTemperatureChart } from "./TemperatureChart";

export function displayForecast(data) {
  const forecastList = document.getElementById("forecast-list");
  forecastList.innerHTML = "";

  const uniqueDays = Array.from(new Set(data.list.map((item) => item.dt_txt.split(" ")[0]))).slice(0, 7);

  uniqueDays.forEach((date) => {
    const dayData = data.list.find((item) => item.dt_txt.startsWith(date) && item.dt_txt.includes("12:00:00"));
    if (dayData) {
      const dayName = new Date(dayData.dt_txt).toLocaleDateString("cs-CZ", { weekday: "short" });
      const temp = dayData.main.temp.toFixed(1);
      const iconCode = dayData.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

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
