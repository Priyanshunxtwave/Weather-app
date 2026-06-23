document.addEventListener('DOMContentLoaded', async () => {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const searchSubmitBtn = searchForm.querySelector('.search-submit-btn');
    const clearSearchBtn = document.getElementById('clear-search-btn');
    const loadingSpinner = document.getElementById('loading-spinner');
    const errorBanner = document.getElementById('error-banner');
    
    // Suggestion box element reference binding target
    const suggestionsBox = document.getElementById('suggestions-box');
    let debounceTimer;

    // --- APPLICATION STARTUP SEQUENCE ---
    const savedLocation = StorageManager.getSavedLocation();
    if (savedLocation) {
        searchInput.value = savedLocation.name;
        clearSearchBtn.hidden = false;
        await loadWeatherPipeline(savedLocation);
    }

    // Capture user typing patterns to query suggestions dynamically
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim();
        clearSearchBtn.hidden = query === '';
        
        // Clear active timing loops to delay calculations while typing rapidly
        clearTimeout(debounceTimer);

        if (query.length < 2) {
            suggestionsBox.hidden = true;
            return;
        }

        // Instantiate a 300ms debounce buffer wait state block
        debounceTimer = setTimeout(async () => {
            const matches = await OpenMeteoAPI.fetchCitySuggestions(query);
            renderSuggestionsMenu(matches);
        }, 300);
    });

    /**
     * Build and output recommendation elements to the overlay box UI
     */
    function renderSuggestionsMenu(cities) {
        if (cities.length === 0) {
            suggestionsBox.hidden = true;
            return;
        }

        suggestionsBox.innerHTML = '';
        
        cities.forEach(city => {
            const countryStr = city.country ? `, ${city.country}` : '';
            const adminStr = city.admin1 ? ` (${city.admin1})` : '';
            
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.textContent = `${city.name}${adminStr}${countryStr}`;
            
            // Intercept direct list clicks to execute instantly
            div.addEventListener('click', async () => {
                searchInput.value = city.name;
                suggestionsBox.hidden = true;
                clearSearchBtn.hidden = false;

                const selectedLocation = {
                    name: city.name,
                    country: city.country,
                    latitude: city.latitude,
                    longitude: city.longitude
                };

                StorageManager.saveLocation(selectedLocation);
                await loadWeatherPipeline(selectedLocation);
            });

            suggestionsBox.appendChild(div);
        });

        suggestionsBox.hidden = false;
    }

    // Dismiss active suggestion overlay if the user clicks out of the input form element area
    document.addEventListener('click', (e) => {
        if (!searchForm.contains(e.target)) {
            suggestionsBox.hidden = true;
        }
    });

    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearSearchBtn.hidden = true;
        errorBanner.hidden = true;
        suggestionsBox.hidden = true;
        StorageManager.clearLocation();
        UI.resetUI();
        searchInput.focus();
    });

    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (!query) return;

        // Immediately close recommendation windows on form enter triggers
        suggestionsBox.hidden = true;
        toggleFormState(true);

        try {
            const locationData = await OpenMeteoAPI.fetchCoordinates(query);
            StorageManager.saveLocation(locationData);
            await loadWeatherPipeline(locationData);
        } catch (error) {
            console.error('Execution Chain Exception:', error.message);
            errorBanner.textContent = error.message;
            errorBanner.hidden = false;
        } finally {
            toggleFormState(false);
        }
    });

    async function loadWeatherPipeline(locationObj) {
        errorBanner.hidden = true;
        loadingSpinner.hidden = false;
        try {
            const weatherData = await OpenMeteoAPI.fetchWeatherData(locationObj.latitude, locationObj.longitude);
            UI.renderCurrentWeather(locationObj, weatherData);
            UI.renderForecast(weatherData.daily);
            UI.renderHourlyInsights(weatherData.hourly);
        } catch (error) {
            errorBanner.textContent = error.message;
            errorBanner.hidden = false;
        } finally {
            loadingSpinner.hidden = true;
        }
    }

    function toggleFormState(isLoading) {
        searchInput.disabled = isLoading;
        searchSubmitBtn.disabled = isLoading;
        clearSearchBtn.disabled = isLoading;
        if (isLoading) errorBanner.hidden = true;
        loadingSpinner.hidden = !isLoading;
    }
});