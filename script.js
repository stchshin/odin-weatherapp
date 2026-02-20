async function weather(location) {
    try {
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=XC5M6BGA9GVKYWAGTGHU95DC2`)
        const weatherData = await response.json();
        return weatherData;
    } catch(error) {
        alert('Location does not exist!')
    }
}

function temperatureSwitch(temperature, currentType) {
    if (currentType == 'F') {
        return (Math.round((temperature - 32) * 5 / 9 * 10) / 10).toFixed(1);
    } else {
        return (Math.round((temperature * 9 / 5 + 32) * 10) / 10).toFixed(1);
    }
}

function toggleTemperature() {
    document.querySelectorAll('.temperature').forEach(temperature => {
        const currentTemp = temperature.textContent.slice(0, temperature.textContent.length - 2);
        if (temperature.dataset.temperature == 'F') {
            temperature.textContent = `${temperatureSwitch(currentTemp, 'F')}°C`;
            temperature.dataset.temperature = 'C';
        } else {
            temperature.textContent = `${temperatureSwitch(currentTemp, 'C')}°F`;
            temperature.dataset.temperature = 'F';
        }
    })
}

async function displayWeather(location) {
    const weatherData = await weather(location);
    document.querySelector('#info').textContent = '';
    document.querySelector('#description').textContent = '';
    document.querySelector('#futureContainer').textContent = '';
    document.querySelector('#temperatureSwitch').style.display = 'block';

    const icon = document.createElement("img");
    icon.src = `images/${weatherData.currentConditions.icon}.png`;
    icon.setAttribute("id", "mainIcon");

    const current = document.createElement("div");
    current.setAttribute("id", "currentWeather");
    
    const city = document.createElement("div");
    city.textContent = location.slice(0, 1).toUpperCase() + location.slice(1).toLowerCase();
    city.style.fontSize = '2.3rem';

    const temperatureInfo = document.createElement("div");
    const temperature = document.createElement("span");
    temperature.textContent = `${weatherData.currentConditions.temp}°F`;
    const condition = document.createElement("span");
    condition.textContent = `, ${weatherData.currentConditions.conditions}`;

    temperatureInfo.append(temperature, condition)
    temperatureInfo.style.fontSize = '1.8rem';
    temperature.setAttribute('data-temperature', 'F');
    temperature.setAttribute('class', 'temperature');
        
    current.append(city, temperatureInfo);
    document.querySelector('#info').append(icon, current);

    // Future temperatures (weekly)
    const futureWeather = weatherData.days.slice(1, 8);
    const futureContainer = document.querySelector('#futureContainer');
    for (day of futureWeather) {
        const dayContainer = document.createElement("div");
        dayContainer.classList.add("dayContainer");
        const date = document.createElement("div");
        const temp = document.createElement("div");
        date.textContent = day.datetime.slice(-5);
        temp.textContent = `${(Math.round(day.temp * 100) / 100).toFixed(1)}°F`;

        temp.setAttribute('data-temperature', 'F');
        temp.setAttribute('class', 'temperature');

        date.style.fontSize = '1rem';
        temp.style.fontSize = '1.4rem';
        
        dayContainer.append(date, temp);
        futureContainer.append(dayContainer);
    }

    document.querySelector('#description').textContent = weatherData.description;

    // Toggle temperature units
    const switchButton = document.querySelector('#temperatureSwitch');
    switchButton.removeEventListener('click', toggleTemperature);
    switchButton.addEventListener('click', toggleTemperature);
}

document.querySelector('button').addEventListener('click', function(event) {
    event.preventDefault();
    const location = document.querySelector('input').value;
    displayWeather(location);
})

