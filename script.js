const cityInputEl = $('#city-input');
const searchBtn = $('#search-button');
const pastSearchedCitiesEl = $('#past-search');
const APIkey = "069e2e9bac8e627afb68d8cfdf9c509d";
let currentCity;

// Function to handle search button click event
const handleSearch = () => {
  // Get user input from search bar
  const city = cityInputEl.val().trim();

  // Call API to get weather data for city
  const requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}`;
  fetch(requestUrl)
    .then(response => response.json())
    .then(data => {
      // Save current city for later use
      currentCity = data.name;

      // Call function to display weather data
      displayWeather(data);
    })
    .catch(error => console.error(error));
};

// Function to display weather data
const displayWeather = (data) => {
  // Call API to get forecast data for city
  const requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=minutely,hourly,alerts&units=metric&appid=${APIkey}`;
  fetch(requestUrl)
    .then(response => response.json())
    .then(data => {
      // Display current weather data
      const currentConditionsEl = $('#currentConditions');
      currentConditionsEl.addClass('border border-primary');

      // Create city name element and display
      const cityNameEl = $('<h2>').text(currentCity);
      const currentCityDate = moment.unix(data.current.dt).format("MM/DD/YYYY");
      const currentDateEl = $('<span>').text(` (${currentCityDate}) `);
      cityNameEl.append(currentDateEl);
      const currentCityWeatherIcon = data.current.weather[0].icon;
      const currentWeatherIconEl = $('<img>').attr("src", `http://openweathermap.org/img/wn/${currentCityWeatherIcon}.png`);
      cityNameEl.append(currentWeatherIconEl);
      currentConditionsEl.append(cityNameEl);

      // Get current temp data and display
      const currentTempEl = $('<p>').text(`Temp: ${data.current.temp}°C`);
      currentConditionsEl.append(currentTempEl);

      // Get current wind speed and display
      const currentWindEl = $('<p>').text(`Wind: ${data.current.wind_speed} KPH`);
      currentConditionsEl.append(currentWindEl);

      // Get current humidity and display
      const currentHumidityEl = $('<p>').text(`Humidity: ${data.current.humidity}%`);
      currentConditionsEl.append(currentHumidityEl);

      // Get current UV index, set background color based on level and display
      const currentUvEl = $('<p>');
      const currentUvSpanEl = $('<span>').text(`UV: ${data.current.uvi}`);
      currentUvEl.append(currentUvSpanEl);
      if (data.current.uvi < 3) {
        currentUvSpanEl.css({
          'background-color': 'green',
          'color': 'white'
        });
      } else if (data.current.uvi < 6) {
        currentUvSpanEl.css({
          'background-color': 'yellow',
          'color': 'black'
        });
      }

     // Add current UV index element to current conditions element
currentConditionsEl.append(currentUvEl);

// Five day forecast
const fiveDayEl = $('#fiveDay');
fiveDayEl.empty();
for (let i = 1; i <= 5; i++) {
const forecastEl = $('<div>').addClass('col card text-white bg-primary mr-2');
const forecastDate = moment.unix(data.daily[i].dt).format("MM/DD/YYYY");
const forecastDateEl = $('<h5>').addClass('card-header').text(forecastDate);
forecastEl.append(forecastDateEl);
const forecastIcon = data.daily[i].weather[0].icon;
const forecastIconEl = $('<img>').attr("src", http://openweathermap.org/img/wn/${forecastIcon}.png);
forecastEl.append(forecastIconEl);
const forecastTempEl = $('<p>').addClass('card-text').text(Temp: ${data.daily[i].temp.day}°C);
forecastEl.append(forecastTempEl);
const forecastWindEl = $('<p>').addClass('card-text').text(Wind: ${data.daily[i].wind_speed} KPH);
forecastEl.append(forecastWindEl);
const forecastHumidityEl = $('<p>').addClass('card-text').text(Humidity: ${data.daily[i].humidity}%);
forecastEl.append(forecastHumidityEl);
fiveDayEl.append(forecastEl);
};


// When search button is clicked, get weather data for input city
searchBtn.on('click', function(event) {
event.preventDefault();
const city = cityInputEl.val();
if (city) {
currentCity = city;
getCityCoords(city);
}
});

// When a past searched city is clicked, get weather data for that city
pastSearchedCitiesEl.on('click', '.past-city', function() {
const city = $(this).text();
currentCity = city;
getCityCoords(city);
});

// Add onclick listener to search bar for input city
cityInputEl.on('keydown', function(event) {
if (event.keyCode === 13) {
event.preventDefault();
const city = cityInputEl.val();
if (city) {
currentCity = city;
getCityCoords(city);
}
}
});