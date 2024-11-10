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

// Změna pozadí na základě ikony počasí
export function changeBackground(iconCode) {
  const backgroundImage =
    weatherBackgrounds[iconCode] || "url('/img/default-picture.jpg')";
  document.body.style.backgroundImage = backgroundImage;
}
