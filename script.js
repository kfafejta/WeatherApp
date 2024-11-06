const API_KEY = "2f8e67d70e1b175009bc095503ac10f5";
const CITY_JSON_PATH = "./city.list.json";
const cityInput = document.getElementById("city-input");
const suggestions = document.getElementById("suggestions");
const cityName = document.getElementById("city-name");
const forecastList = document.getElementById("forecast-list");
const temperatureChartCanvas = document.getElementById("temperatureChart");
const locationIcon = document.querySelector(".location-icon");

let cities = [];
let temperatureChart;

// Obrázky pro různé druhy počasí uložené ve složce "img"
const weatherBackgrounds = {
  "11d": "url(./img/bourka.jpg)",
  "11n": "url(./img/bourka.jpg)",
  "09d": "url(./img/dest.jpg)",
  "09n": "url(./img/dest.jpg)",
  "010n": "url(./img/dest.jpg)",
  "010d": "url(./img/dest.jpg)",
  "01d": "url(./img/slunecno.jpg)",
  "01n": "url(./img/slunecno.jpg)",
  "02n": "url(./img/polojasno.jpg)",
  "02d": "url(./img/polojasno.jpg)",
  "13d": "url(./img/snih.jpg)",
  "13n": "url(./img/snih.jpg)",
  "04d": "url(./img/oblacno.jpg)",
  "04n": "url(./img/oblacno.jpg)",
  "03d": "url(./img/oblacno.jpg)",
  "03n": "url(./img/oblacno.jpg)",
  "050n": "url(./img/mlha.jpg)",
  "050d": "url(./img/mlha.jpg)",
};

// Funkce pro změnu pozadí na základě ikony počasí
function changeBackground(iconCode) {
  const backgroundImage = weatherBackgrounds[iconCode];
  document.body.style.backgroundImage =
    backgroundImage || "url('./img/default-picture.jpg')";
}

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

// Výběr města a načtení předpovědi počasí
function selectCity(city) {
  cityInput.value = city;
  suggestions.innerHTML = "";
  getWeatherForecast(city);
}

// Získání předpovědi počasí na základě aktuální polohy uživatele
function getWeatherForCurrentLocation() {
  getUserLocation();
}

// Získání polohy uživatele a načtení počasí na základě souřadnic
function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoordinates(latitude, longitude);
      },
      (error) => {
        console.error("Chyba při získávání polohy:", error);
        alert("Nelze zjistit vaši polohu.");
      }
    );
  } else {
    alert("Geolokace není podporována vaším prohlížečem.");
  }
}

// Načtení počasí na základě zeměpisné šířky a délky
function fetchWeatherByCoordinates(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
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
        displayTemperatureChart(data, new Date().toISOString().split("T")[0]);

        // Změníme pozadí pouze po úspěšném načtení předpovědi
        const firstDayIcon = data.list[0].weather[0].icon;
        changeBackground(firstDayIcon);
      } else {
        console.error("Data o městě nejsou k dispozici.");
      }
    })
    .catch((error) => console.error("Chyba při načítání předpovědi:", error));
}

locationIcon.addEventListener("click", getWeatherForCurrentLocation);

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
        displayTemperatureChart(data, new Date().toISOString().split("T")[0]);

        // Změníme pozadí pouze po úspěšném načtení předpovědi
        const firstDayIcon = data.list[0].weather[0].icon;
        changeBackground(firstDayIcon);
      } else {
        console.error("Data o městě nejsou k dispozici.");
      }
    })
    .catch((error) => console.error("Chyba při načítání předpovědi:", error));
}

// Zobrazení předpovědi ve formě seznamu pro 5 dní včetně dnešního dne
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
        changeBackground(iconCode);
      });
      forecastList.appendChild(listItem);
    }
  });
}

// Zobrazení grafu teploty pro vybraný den s tříhodinovými intervaly
function displayTemperatureChart(data, selectedDate) {
  const dailyData = data.list.filter((item) =>
    item.dt_txt.startsWith(selectedDate)
  );

  const labels = [];
  const temperatures = [];

  // Přidání všech časů od 00:00 do 21:00 v tříhodinových intervalech
  for (let hour = 0; hour <= 21; hour += 3) {
    const timeLabel = new Date(
      `${selectedDate}T${hour.toString().padStart(2, "0")}:00:00`
    );
    labels.push(
      timeLabel.toLocaleTimeString("cs-CZ", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );

    const dataPoint = dailyData.find((item) => {
      const itemDate = new Date(item.dt_txt);
      return (
        itemDate.getHours() === timeLabel.getHours() &&
        itemDate.toDateString() === timeLabel.toDateString()
      );
    });

    temperatures.push(dataPoint ? dataPoint.main.temp : null);
  }

  // Přidání posledního bodu pro 24:00
  labels.push("24:00");
  const lastDataPoint = dailyData.find(
    (item) => new Date(item.dt_txt).getHours() === 0
  );
  temperatures.push(
    lastDataPoint
      ? lastDataPoint.main.temp
      : temperatures[temperatures.length - 1]
  );

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
          ticks: {
            autoSkip: false,
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
