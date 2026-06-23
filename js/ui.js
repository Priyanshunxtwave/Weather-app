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
    },
    forecastContainer: document.getElementById('forecast-container'),
    insightsContainer: document.getElementById('insights-container'),

    /**
     * Parse and render horizontal 5-day forecast cards
     */
    renderForecast(dailyData) {
        this.forecastContainer.innerHTML = ''; // Reset structural view frame

        // Loop over 5 structural days (Index 0 is Today, up to Index 4)
        for (let i = 0; i < 5; i++) {
            const dayName = i === 0 ? 'TODAY' : WeatherUtils.formatShortDay(dailyData.time[i]);
            const condition = WeatherUtils.getCondition(dailyData.weather_code[i]);
            const maxTemp = Math.round(dailyData.temperature_2m_max[i]);
            const minTemp = Math.round(dailyData.temperature_2m_min[i]);
            
            const isTodayClass = i === 0 ? 'forecast-card today-card' : 'forecast-card';

            const cardHTML = `
                <div class="${isTodayClass}">
                    <span class="fc-day">${dayName}</span>
                    <div class="fc-icon">${condition.icon}</div>
                    <div class="fc-temps">
                        <span class="temp-high">${maxTemp}°</span>
                        <span class="temp-low">${minTemp}°</span>
                    </div>
                </div>
            `;
            this.forecastContainer.insertAdjacentHTML('beforeend', cardHTML);
        }
    },

    /**
     * Parse and render the next 6 chronological hourly rows 
     */
    renderHourlyInsights(hourlyData) {
        this.insightsContainer.innerHTML = ''; // Reset layout frame

        // Identify the current hour index from the local timeline array to show upcoming hours
        const nowMs = Date.now();
        let startIndex = hourlyData.time.findIndex(t => new Date(t).getTime() >= nowMs);
        if (startIndex === -1) startIndex = 0; // Fallback to index 0 if time mismatch occurs

        // Take 6 chronological entries from our identified index position
        for (let i = startIndex; i < startIndex + 6; i++) {
            if (!hourlyData.time[i]) break; // Safety check in case timeline boundary ends

            const hourLabel = WeatherUtils.formatShortHour(hourlyData.time[i]);
            const condition = WeatherUtils.getCondition(hourlyData.weather_code[i]);
            const tempValue = Math.round(hourlyData.temperature_2m[i]);

            const rowHTML = `
                <div class="hourly-row">
                    <span class="hr-time">${hourLabel}</span>
                    <div class="hr-condition">
                        <div class="hr-icon">${condition.icon}</div>
                        <span class="hr-text">${condition.text}</span>
                    </div>
                    <span class="hr-temp">${tempValue}°C</span>
                </div>
            `;
            this.insightsContainer.insertAdjacentHTML('beforeend', rowHTML);
        }
    },
    /**
     * Revert the entire user interface back to its pristine empty state
     */
    resetUI() {
        // 1. Clear text contents from placeholders
        this.locationText.textContent = '---, ---';
        this.dateText.textContent = '---';
        this.temperatureText.textContent = '--';
        this.conditionText.textContent = '---';
        this.iconContainer.innerHTML = '';
        
        this.humidityValue.textContent = '--%';
        this.windValue.textContent = '-- km/h';
        this.pressureValue.textContent = '---- hPa';

        // 2. Wipe dynamic card containers clean
        this.forecastContainer.innerHTML = '';
        this.insightsContainer.innerHTML = '';

        // 3. Reset background color metrics to neutral state
        this.tempArea.className = 'weather-temp-display temp-neutral';

        // 4. Swap element visibility toggles back to empty presentation mode
        this.populatedState.hidden = true;
        this.card.classList.add('container-empty');
        this.emptyState.hidden = false;
    }
};