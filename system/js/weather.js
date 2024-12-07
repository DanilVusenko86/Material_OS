const apiKey = '742bd35759c7a503c00769da302c6ad1';  // OpenWeatherMap API key

const iconMap = {
    "01d": "img/icons/CLEAR.svg",
    "01n": "img/icons/CLEAR0.svg",
    "02d": "img/icons/PCLOUDY.svg",
    "02n": "img/icons/PCLOUDY0.svg",
    "03d": "img/icons/cloudy.svg",
    "03n": "img/icons/cloudy.svg",
    "04d": "img/icons/cloudy.svg",
    "04n": "img/icons/cloudy.svg",
    "09d": "img/icons/rain.svg",
    "09n": "img/icons/rain0.svg",
    "10d": "img/icons/SHOWER.svg",
    "10n": "img/icons/SHOWER0.svg",
    "11d": "img/icons/TSTORM.svg",
    "11n": "img/icons/TSTORM0.svg",
    "13d": "img/icons/snow.svg",
    "13n": "img/icons/snow0.svg",
    "50d": "img/icons/fog.svg",
    "50n": "img/icons/fog0.svg"
};

// Automatically get the user's location on page load
document.addEventListener('DOMContentLoaded', function() {
    getLocation();
});

// Function to update the weather widget
function updateWeatherWidget(data) {
    const city = data.name;
    const temp = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const windSpeed = Math.round(data.wind.speed * 3.6); // Convert m/s to km/h
    const humidity = data.main.humidity;

    document.getElementById('city').textContent = city;
    document.getElementById('temperature').textContent = `${temp}°C`;
    document.getElementById('description').textContent = description;
    document.getElementById('wind-speed').textContent = `${windSpeed} km/h`;
    document.getElementById('humidity').textContent = `${humidity}%`;

    const iconPath = iconMap[iconCode] || "../img/icons/clear_day.svg";
    document.getElementById('weather-icon').src = iconPath;
}

// Get location from IP-based service (ip-api.com) instead of navigator.geolocation
function getLocation() {
    const geoApiUrl = 'http://ip-api.com/json/';  // ip-api URL to get location by IP

    fetch(geoApiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const lat = data.lat;
                const lon = data.lon;
                getWeather(lat, lon);  // Fetch weather using lat/lon from ip-api
            } else {
                M.toast({html: `Error fetching location: ${data.message}`, classes: 'red'});
            }
        })
        .catch(error => M.toast({html: `Error: ${error.message}`, classes: 'red'}));
}

// Fetch weather data using OpenWeatherMap API
function getWeather(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                updateWeatherWidget(data);  // Update UI with weather data
            } else {
                M.toast({html: `Error: ${data.message}`, classes: 'red'});
            }
        })
        .catch(error => M.toast({html: `Error: ${error.message}`, classes: 'red'}));
}
