const API_KEY = "2f8e67d70e1b175009bc095503ac10f5";
const CITY_JSON_PATH = "./city.list.json";
const cityInput = document.getElementById("city-input");
const suggestions = document.getElementById("suggestions");
const cityName = document.getElementById("city-name");
const weatherDescription = document.getElementById("weather-description");
const forecastList = document.getElementById("forecast-list");
const temperatureChartCanvas = document.getElementById("temperatureChart");

let cities = [];
let temperatureChart;

// Předpokládané obrázky pro různé druhy počasí ve složce "img"
const weatherBackgrounds = {
  "11d": "url(./img/bourka.jpg)", // Bouřka (den)
  "11n": "url(./img/bourka.jpg)", // Bouřka (noc)
  "09d": "url(./img/dest.jpg)", // Déšť (den)
  "09n": "url(./img/dest.jpg)", // Déšť (noc)
  "01d": "url(./img/slunecno.jpg)", // Slunečno (den)
  "01n": "url(./img/slunecno.jpg)", // Slunečno (noc)
  "13d": "url(./img/snih.jpg)", // Sníh (den)
  "13n": "url(./img/snih.jpg)", // Sníh (noc)
  "04d": "url(./img/oblacno.jpg)", // Oblačno (den)
  "04n": "url(./img/oblacno.jpg)", // Oblačno (noc)
};

// Načtení měst ze souboru JSON
fetch(CITY_JSON_PATH)
  .then((response) => response.json())
  .then((data) => (cities = data))
  .catch((error) => console.error("Chyba při načítání měst:", error));

cityInput.addEventListener("input", () => {
  const inputValue = cityInput.value.toLowerCase();
  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(inputValue)
  );

  suggestions.innerHTML = "";
  filteredCities.forEach((city) => {
    const li = document.createElement("li");
    li.textContent = city.name;
    li.addEventListener("click", () => selectCity(city.name));
    suggestions.appendChild(li);
  });
});

function selectCity(city) {
  cityInput.value = city;
  suggestions.innerHTML = "";
  getWeatherForecast(city);
}

// Načtení předpovědi počasí z OpenWeatherMap API
function getWeatherForecast(city) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Chyba při načítání dat o počasí");
      }
      return response.json();
    })
    .then((data) => {
      if (data && data.city) {
        cityName.textContent = `Počasí: ${data.city.name}`;
        displayForecast(data);
        // Zobrazíme graf pro dnešní den po načtení
        displayTemperatureChart(data, new Date().toISOString().split("T")[0]);
      } else {
        console.error("Data o městě nejsou k dispozici.");
      }
    })
    .catch((error) => console.error("Chyba při načítání předpovědi:", error));
}

// Zobrazení předpovědi ve formě seznamu pro 7 dní včetně dnešního dne
function displayForecast(data) {
  forecastList.innerHTML = "";

  const uniqueDays = [];
  data.list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    if (!uniqueDays.includes(date) && uniqueDays.length < 7) {
      uniqueDays.push(date);
    }
  });

  uniqueDays.forEach((date) => {
    const dayData = data.list.find(
      (item) => item.dt_txt.startsWith(date) && item.dt_txt.includes("12:00:00")
    );
    if (dayData) {
      const dateObj = new Date(dayData.dt_txt);
      const dayName = dateObj.toLocaleDateString("cs-CZ", { weekday: "short" });
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
        changeBackground(iconCode); // Změna pozadí při kliknutí na den
      });
      forecastList.appendChild(listItem);
    }
  });
}

// Změna pozadí na základě počasí
function changeBackground(iconCode) {
  const backgroundImage = weatherBackgrounds[iconCode] || "url(./default.jpg)"; // Defaultní obrázek pokud kód není uveden
  document.body.style.backgroundImage = backgroundImage;
}

// Zobrazení grafu teploty pro vybraný den
function displayTemperatureChart(data, selectedDate) {
  const dailyData = data.list.filter((item) =>
    item.dt_txt.startsWith(selectedDate)
  );

  const labels = [];
  const temperatures = [];

  dailyData.forEach((item) => {
    const date = new Date(item.dt_txt);
    labels.push(
      date.toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" })
    );
    temperatures.push(item.main.temp);
  });

  if (temperatureChart) {
    temperatureChart.destroy();
  }

  temperatureChart = new Chart(temperatureChartCanvas, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Teplota",
          data: temperatures,
          borderColor: "rgba(255, 215, 0, 1)",
          backgroundColor: "rgba(255, 215, 0, 0.2)",
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointBackgroundColor: "rgba(255, 215, 0, 1)",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          grid: {
            color: "#444",
          },
          title: {
            display: true,
            text: "Čas",
            color: "#ddd",
          },
        },
        y: {
          grid: {
            color: "#444",
          },
          title: {
            display: true,
            text: "Teplota (°C)",
            color: "#ddd",
          },
          beginAtZero: false,
        },
      },
    },
  });
}
