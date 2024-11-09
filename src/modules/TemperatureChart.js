import { Chart } from "chart.js/auto";

let temperatureChart;

export function displayTemperatureChart(data, selectedDate) {
  const dailyData = data.list.filter((item) => item.dt_txt.startsWith(selectedDate));

  const labels = Array.from({ length: 8 }, (_, i) => {
    const hour = i * 3;
    return new Date(`${selectedDate}T${String(hour).padStart(2, "0")}:00:00`).toLocaleTimeString("cs-CZ", {
      hour: "2-digit",
      minute: "2-digit",
    });
  });
  labels.push("24:00");

  const temperatures = labels.map((_, i) => {
    const hour = i < 8 ? i * 3 : 0;
    const dataPoint = dailyData.find((item) => new Date(item.dt_txt).getHours() === hour);
    return dataPoint ? dataPoint.main.temp : null;
  });

  if (temperatureChart) temperatureChart.destroy();
  temperatureChart = new Chart(document.getElementById("temperatureChart"), {
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
