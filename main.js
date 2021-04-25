// current date and time //
function formatDay(timestamp) {
  let date = new Date(timestamp);
  let weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  return weekdays[date.getDay()];
}

function formatDate(timestamp) {
  let today = new Date(timestamp);

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

  let month = months[today.getMonth()];
  let date = today.getDate();
  let year = today.getFullYear();

  return `${month} ${date}, ${year}`;
}

function formatTime(timestamp) {
  let now = new Date(timestamp);
  let hour = now.getHours();
  let minutes = now.getMinutes();

  if (hour < 10) {
    hour = `0${hour}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${hour}:${minutes}`;
}

// ºC click button change to ºF //
let unitBtn = document.querySelector("#unit-btn");
let unit = "metric";
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
    unit = "imperial";
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
  document.querySelector("#current-day").innerHTML = `${formatDay(
    response.data.dt * 1000
  )}`;
  document.querySelector("#current-full-date").innerHTML = `${formatDate(
    response.data.dt * 1000
  )}`;
  document.querySelector("#current-time").innerHTML = `${formatTime(
    response.data.dt * 1000
  )}`;
  document.querySelector("#city").innerHTML = response.data.name;
  currentTemp = Math.round(response.data.main.temp);
  document.querySelector("#current-temp").innerHTML = currentTemp;
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  currentWind = Math.round(response.data.wind.speed);
  document.querySelector("#wind").innerHTML = Math.round(currentWind) + ` km/h`;
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;
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

  getForecast(response.data.coord);
}

searchBtn.addEventListener("click", showCity);

function search(city) {
  let apiKey = "7188b6a77c9693ed94470114f98e8761";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
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
  currentTemp = Math.round(response.data.main.temp);
  document.querySelector("#current-temp").innerHTML = currentTemp;
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  currentWind = Math.round(response.data.wind.speed);
  document.querySelector("#wind").innerHTML = Math.round(currentWind) + ` km/h`;
  document.querySelector("#city").innerHTML = response.data.name;
}

function getCoords() {
  navigator.geolocation.getCurrentPosition(showCoords);
}

locationBtn.addEventListener("click", getCoords);

function showForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");
  
  forecast.forEach(function(forecastDay, index) {
    if (index === 1) {
      forecastHTML = `
      <div class="row">
        <div class="col-12">
          <div class="card dark">
            <div class="card-body">
              <div class="col-12">
                <p class="card-text">${formatDay(forecastDay.dt)}</p>
                <hr />
              </div>
              <div class="row">
                <div class="col-6">
                  <p class="card-text">
                    <img src="https://openweathermap.org/img/wn/${
                      forecastDay.weather[0].icon
                    }@2x.png" alt="" width="42px" />
                  </p>
                </div>
                <div class="col-6">
                  <p class="card-text center weekday-weather-temps">
                    ${Math.round(forecastDay.temp.min)}
                    <br />
                    <strong class="high">${Math.round(
                      forecastDay.temp.max
                    )}</strong>
                  </p>
                  <hr class="low-over-high" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      `;
    }
    if (index > 1 && index < 5) {
      forecastHTML =
        `
      <div class="row">
        <div class="col-6">
          <div class="card dark">
            <div class="card-body">
              <div class="col-12">
              <p class="card-text">${formatDay(forecastDay.dt)}</p>
              <hr />
              </div>
              <div class="row">
                <div class="col-6">
                  <p class="card-text">
                    <img src="https://openweathermap.org/img/wn/${
                      forecastDay.weather[0].icon
                    }@2x.png" alt="" width="42px" />
                  </p>
                </div>
                <div class="col-6">
                <p class="card-text center weekday-weather-temps">
                  ${Math.round(forecastDay.temp.min)}
                  <br />
                  <strong class="high">${Math.round(
                    forecastDay.temp.max
                  )}</strong>
                </p>
                <hr class="low-over-high" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      `;
    }
  });

  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "7188b6a77c9693ed94470114f98e8761";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showForecast);
}

// load a default
search("Santa Monica");
