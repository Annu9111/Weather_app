const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const countryName = document.getElementById("countryName");

const temperature = document.getElementById("temperature");
const feelsLike = document.getElementById("feelsLike");

const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");

const weatherDescription =
    document.getElementById("weatherDescription");

const weatherIcon =
    document.getElementById("weatherIcon");

const errorMessage =
    document.getElementById("errorMessage");

const loading =
    document.getElementById("loading");

const updatedTime =
    document.getElementById("updatedTime");

const weatherInfo =
    document.getElementById("weatherInfo");


// Search button

searchBtn.addEventListener("click", getWeather);


// Press Enter

cityInput.addEventListener("keypress", function(event) {

    if (event.key === "Enter") {
        getWeather();
    }

});


// Main function

async function getWeather() {

    const city = cityInput.value.trim();

    if (city === "") {

        showError("Please enter a city name.");

        return;
    }

    try {

        errorMessage.textContent = "";

        loading.style.display = "block";

        weatherInfo.style.display = "none";


        // Get city coordinates

        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const geoResponse = await fetch(geoURL);

        const geoData = await geoResponse.json();


        if (!geoData.results || geoData.results.length === 0) {

            showError("City not found.");

            return;
        }


        const location = geoData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;


        // Weather API

        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;

        const weatherResponse =
            await fetch(weatherURL);

        const weatherData =
            await weatherResponse.json();


        const current = weatherData.current;


        // Display city

        cityName.textContent = location.name;

        countryName.textContent =
            `${location.country}`;


        // Display temperature

        temperature.textContent =
            Math.round(current.temperature_2m);


        // Feels like

        feelsLike.textContent =
            Math.round(current.apparent_temperature);


        // Humidity

        humidity.textContent =
            current.relative_humidity_2m;


        // Wind

        windSpeed.textContent =
            Math.round(current.wind_speed_10m);


        // Weather description

        const weather =
            getWeatherDescription(current.weather_code);

        weatherDescription.textContent =
            weather.description;

        weatherIcon.textContent =
            weather.icon;


        // Updated time

        updatedTime.textContent =
            new Date().toLocaleTimeString();


        weatherInfo.style.display = "block";

    }

    catch (error) {

        showError(
            "Something went wrong. Please try again."
        );

        console.error(error);

    }

    finally {

        loading.style.display = "none";

    }

}


// Weather code function

function getWeatherDescription(code) {

    if (code === 0) {

        return {
            description: "Clear Sky",
            icon: "☀️"
        };

    }

    if (code === 1 || code === 2) {

        return {
            description: "Partly Cloudy",
            icon: "🌤️"
        };

    }

    if (code === 3) {

        return {
            description: "Overcast",
            icon: "☁️"
        };

    }

    if (code >= 45 && code <= 48) {

        return {
            description: "Foggy",
            icon: "🌫️"
        };

    }

    if (code >= 51 && code <= 67) {

        return {
            description: "Rain",
            icon: "🌧️"
        };

    }

    if (code >= 71 && code <= 77) {

        return {
            description: "Snow",
            icon: "❄️"
        };

    }

    if (code >= 80 && code <= 82) {

        return {
            description: "Rain Showers",
            icon: "🌦️"
        };

    }

    if (code >= 95) {

        return {
            description: "Thunderstorm",
            icon: "⛈️"
        };

    }

    return {
        description: "Unknown",
        icon: "🌍"
    };

}


// Error function

function showError(message) {

    errorMessage.textContent = message;

    loading.style.display = "none";

    weatherInfo.style.display = "none";

}