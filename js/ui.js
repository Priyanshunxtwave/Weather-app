/**
 * DOM Manipulation Interface wrapper.
 */
const UI = {
    card: document.getElementById('current-weather-card'),
    emptyState: document.querySelector('.card-empty-state'),
    populatedState: document.querySelector('.card-populated-state'),
    
    locationText: document.getElementById('cw-location'),
    dateText: document.getElementById('cw-date'),
    temperatureText: document.getElementById('cw-temperature'),
    tempArea: document.getElementById('cw-temp-area'),
    iconContainer: document.getElementById('cw-icon-container'),
    conditionText: document.getElementById('cw-condition-text'),
    
    humidityValue: document.getElementById('cw-humidity'),
    windValue: document.getElementById('cw-wind'),
    pressureValue: document.getElementById('cw-pressure'),

    /**
     * Render the weather card with real city and weather parameters
     */
    renderCurrentWeather(location, weather) {
        const current = weather.current;
        const condition = WeatherUtils.getCondition(current.weather_code);

        // 1. Populating Location details
        const countryString = location.country ? `, ${location.country}` : '';
        this.locationText.textContent = `${location.name}${countryString}`;
        this.dateText.textContent = WeatherUtils.formatCurrentDate();

        // 2. Setting temperature and dynamic theme accents
        const tempValue = Math.round(current.temperature_2m);
        this.temperatureText.textContent = tempValue;
        
        // Wipe existing temp color classes, then apply the right one
        this.tempArea.className = 'weather-temp-display';
        this.tempArea.classList.add(WeatherUtils.getTemperatureClass(tempValue));

        // 3. Injecting mapped status labels & inline vector artwork
        this.conditionText.textContent = condition.text;
        this.iconContainer.innerHTML = condition.icon;

        // 4. Populating stat metrics
        this.humidityValue.textContent = `${Math.round(current.relative_humidity_2m)}%`;
        this.windValue.textContent = `${current.wind_speed_10m} km/h`;
        this.pressureValue.textContent = `${Math.round(current.pressure_msl)} hPa`;

        // 5. Flip display visibility states
        this.emptyState.hidden = true;
        this.card.classList.remove('container-empty');
        this.populatedState.hidden = false;
    }
};