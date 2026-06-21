const apiKey = "1f2b60c3d4cb1ff0e51ede45ae4e4457";

const tempEl = document.querySelector(".weather-info h2");
const descEl = document.querySelector(".weather-info p");
const locationEl = document.querySelector(".weather-info span");
const humEl = document.querySelector(".weather-detail .detail-card:nth-child(1) h3");
const windEl = document.querySelector(".weather-detail .detail-card:nth-child(2) h3");
const pressureEl = document.querySelector(".weather-detail .detail-card:nth-child(3) h3");
const visibilityEl = document.querySelector(".weather-detail .detail-card:nth-child(4) h3");
const inputEl = document.querySelector(".search-box input");
const btnEl = document.querySelector(".search-box button");
const weatherCard = document.querySelector(".weather-card");


async function getWeather(cityName) {
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`);
        const data = await res.json();




        tempEl.textContent = Math.round(data.main.temp) + "°C";
        descEl.textContent = data.weather[0].main;
        locationEl.textContent = `${data.name}`;
        humEl.textContent = data.main.humidity + "%";
        windEl.textContent = data.wind.speed + " km/h";
        pressureEl.textContent = data.main.pressure + " hPa";
        visibilityEl.textContent = (data.visibility / 1000).toFixed(1) + " km";


    } catch (err) {
        console.error(err);
        alert("Failed to fetch weather");
    }
}


btnEl.addEventListener("click", () => {
    const city = inputEl.value.trim();
    if (city) getWeather(city);
});

