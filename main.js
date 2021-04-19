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

let currentDay = document.querySelector("#current-day");
currentDay.innerHTML = `${day}`;
let currentDate = document.querySelector("#current-full-date");
currentDate.innerHTML = `${month} ${date}, ${year}`;
let currentTime = document.querySelector("#current-time");

if (minutes < 10) {
  currentTime.innerHTML = `${hour}:0${minutes}`;
} else {
  currentTime.innerHTML = `${hour}:${minutes}`;
}

/* 🙀Bonus Feature
Display a fake temperature (i.e 17) in Celsius and add a link to convert it to Fahrenheit. When clicking on it, it should convert the temperature to Fahrenheit. When clicking on Celsius, it should convert it back to Celsius. */
// fake temp ºC click button change to ºF //
//! innerHTML is changing but it is in array - how do i acces to have all ºC and temperatures change?? !//

let unitBtn = document.querySelector("#unit-btn");
let unit = document.getElementsByClassName(".unit");
let clickCount = 0;
let metric = "ºC";
let imperial = "ºF";

function changeUnit(event) {
  event.preventDefault();
  clickCount++;
  if (clickCount % 2 === 0) {
    unit.innerHTML = `${metric}`;
  } else {
    unit.innerHTML = `${imperial}`;
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
  document.querySelector("#current-temp").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#description").innerHTML =
    response.data.weather[0].main;
}

searchBtn.addEventListener("click", showCity);

// load a default
function search(city) {
  let apiKey = "7188b6a77c9693ed94470114f98e8761";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showSearched);
}

search("California");

// BONUS current location button - When clicking on it, it uses the Geolocation API to get your GPS coordinates and display the city and current temperature using the OpenWeather API.
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
