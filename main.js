// current date and time //
let today = new Date();

let weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

let day = weekdays[today.getDay() - 1];
let month = months[today.getMonth()];
let date = today.getDate();
let year = today.getFullYear();
let hour = today.getHours();
let minutes = today.getMinutes();

if (hour < 10) {
  hour = `0${hour}`;
}
if (minutes < 10) {
  minutes = `0${minutes}`;
}

document.querySelector("#current-day").innerHTML = `${day}`;
document.querySelector("#current-full-date").innerHTML = `${month} ${date}, ${year}`;
document.querySelector("#current-time").innerHTML = `${hour}:${minutes}`;

// ºC click button change to ºF //
let unitBtn = document.querySelector("#unit-btn");
let clickCount = 0;
let currentTemp = null;
let currentWind = 0;

function changeUnit(event) {
  event.preventDefault();
  clickCount++;
  if (clickCount % 2 === 0) {
    unitBtn.innerHTML = `ºC`;
    document.querySelector("#current-temp").innerHTML = currentTemp;
    document.querySelector("#wind").innerHTML = `${currentWind} km/h`;
  } else {
    unitBtn.innerHTML = `ºF`;
    document.querySelector("#current-temp").innerHTML = currentTemp;
    let fahrenheitTemp = Math.round((currentTemp * 9) / 5 + 32);
    document.querySelector("#current-temp").innerHTML = `${fahrenheitTemp}`;
    let milesWind = Math.round(currentWind / 1.609);
    document.querySelector("#wind").innerHTML = `${milesWind} mph`;
  }
}

unitBtn.addEventListener("click", changeUnit);

// display searched city name and temp //
let searchBtn = document.querySelector("#search-btn");

function showCity(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  search(city);
}

function showSearched(response) {
  document.querySelector("#city").innerHTML = response.data.name;
  currentTemp = Math.round(response.data.main.temp);
  document.querySelector("#current-temp").innerHTML = currentTemp;
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  currentWind = Math.round(response.data.wind.speed);
  document.querySelector("#wind").innerHTML = Math.round(
    currentWind
  ) + ` km/h`;
  document.querySelector("#description").innerHTML =
    response.data.weather[0].main;
  document
    .querySelector("#current-icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
  document
    .querySelector("#current-icon")
    .setAttribute("alt", response.data.weather[0].description);
    document.querySelector("#min-temp").innerHTML = Math.round(
      response.data.main.temp_min
    );
    document.querySelector("#max-temp").innerHTML = Math.round(
      response.data.main.temp_max
    );
}

searchBtn.addEventListener("click", showCity);

function search(city) {
  let apiKey = "7188b6a77c9693ed94470114f98e8761";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showSearched);
}

// get temperature at location
let locationBtn = document.querySelector("#location-btn");

function showCoords(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiKey = "7188b6a77c9693ed94470114f98e8761";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showLocal);
}

function showLocal(response) {
  let pulledTemp = Math.round(response.data.main.temp);
  let currentTemp = document.querySelector("#current-temp");
  let location = document.querySelector("#city");
  let pulledLocation = response.data.name;
  location.innerHTML = pulledLocation;
  currentTemp.innerHTML = `${pulledTemp}`;
}

function getCoords() {
  navigator.geolocation.getCurrentPosition(showCoords);
}

locationBtn.addEventListener("click", getCoords);

// load a default
search("Santa Monica");
