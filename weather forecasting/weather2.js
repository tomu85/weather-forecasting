const apiKey = "1f2b60c3d4cb1ff0e51ede45ae4e4457";

const tempEl = document.getElementById("temperature");
const descEl = document.getElementById("description");
const locationEl = document.getElementById("location");
const humEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const pressureEl = document.getElementById("pressure");
const visibilityEl = document.getElementById("visibility");
const currentIconEl = document.getElementById("currentIcon");
const forecastContainer = document.getElementById("forecastContainer");

const inputEl = document.getElementById("cityInput");
const btnEl = document.getElementById("searchBtn");
const geoBtn = document.getElementById("geoBtn");

// Main Weather Fetch Function by City Name
async function fetchWeatherData(cityName) {
    try {
        const currentRes = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
        );
        if (!currentRes.ok) throw new Error("City not found");
        const currentData = await currentRes.json();

        const forecastRes = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`
        );
        const forecastData = await forecastRes.json();

        updateCurrentUI(currentData);
        updateForecastUI(forecastData);
    } catch (err) {
        alert(err.message || "Failed to fetch weather data");
    }
}

// Fetch Weather by Latitude & Longitude (Geolocation)
async function fetchWeatherByCoords(lat, lon) {
    try {
        const currentRes = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );
        const currentData = await currentRes.json();

        const forecastRes = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );
        const forecastData = await forecastRes.json();

        updateCurrentUI(currentData);
        updateForecastUI(forecastData);
    } catch (err) {
        alert("Unable to fetch location weather");
    }
}

function updateCurrentUI(data) {
    tempEl.textContent = `${Math.round(data.main.temp)}°C`;
    descEl.textContent = data.weather[0].description;
    locationEl.textContent = `📍 ${data.name}, ${data.sys.country}`;
    humEl.textContent = `${data.main.humidity}%`;
    windEl.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
    pressureEl.textContent = `${data.main.pressure} hPa`;
    visibilityEl.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
    currentIconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
}

// Accurate 5-Day Forecast Processor
function updateForecastUI(data) {
    forecastContainer.innerHTML = "";

    const todayStr = new Date().toDateString();
    const dailyMap = {};

    // Group 3-hour forecasts by distinct Date
    data.list.forEach(item => {
        const dateObj = new Date(item.dt * 1000);
        const dateStr = dateObj.toDateString();

        // Skip current day to display next 5 days accurately
        if (dateStr === todayStr) return;

        if (!dailyMap[dateStr]) {
            dailyMap[dateStr] = {
                dayName: dateObj.toLocaleDateString("en-US", { weekday: "short" }),
                temps: [],
                icons: []
            };
        }
        dailyMap[dateStr].temps.push(item.main.temp);
        dailyMap[dateStr].icons.push(item.weather[0].icon);
    });

    // Render 5 days
    Object.values(dailyMap).slice(0, 5).forEach(day => {
        const maxTemp = Math.round(Math.max(...day.temps));
        const minTemp = Math.round(Math.min(...day.temps));
        
        // Pick mid-day icon representation
        const icon = day.icons[Math.floor(day.icons.length / 2)] || day.icons[0];

        const card = document.createElement("div");
        card.className = "forecast-card";
        card.innerHTML = `
            <h3>${day.dayName}</h3>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="forecast icon">
            <div class="temp">${maxTemp}°C</div>
            <div class="range">Low: ${minTemp}°C</div>
        `;
        forecastContainer.appendChild(card);
    });
}

// Event Listeners
btnEl.addEventListener("click", () => {
    const city = inputEl.value.trim();
    if (city) fetchWeatherData(city);
});

inputEl.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const city = inputEl.value.trim();
        if (city) fetchWeatherData(city);
    }
});

geoBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
            () => alert("Location permission denied.")
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
});

// Initializing Default City Weather
fetchWeatherData("Raipur");