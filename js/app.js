document.addEventListener('DOMContentLoaded', async () => {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const searchSubmitBtn = searchForm.querySelector('.search-submit-btn');
    const clearSearchBtn = document.getElementById('clear-search-btn');
    const loadingSpinner = document.getElementById('loading-spinner');
    const errorBanner = document.getElementById('error-banner');

    // --- APPLICATION STARTUP SEQUENCE ---
    const savedLocation = StorageManager.getSavedLocation();
    if (savedLocation) {
        searchInput.value = savedLocation.name;
        clearSearchBtn.hidden = false;
        await loadWeatherPipeline(savedLocation);
    }

    searchInput.addEventListener('input', () => {
        clearSearchBtn.hidden = searchInput.value.trim() === '';
    });

    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearSearchBtn.hidden = true;
        errorBanner.hidden = true;
        StorageManager.clearLocation();
        UI.resetUI();
        searchInput.focus();
    });

    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (!query) return;

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

    /**
     * Reusable async data lookup engine wrapper
     */
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

    /**
     * Toggle element interactive capabilities during active operations
     */
   /**
     * Toggle element interactive capabilities during active operations
     */
    function toggleFormState(isLoading) {
    searchInput.disabled = isLoading;
    searchSubmitBtn.disabled = isLoading;
    clearSearchBtn.disabled = isLoading;
    
    // FIX: Only clear previous errors when we are STARTING a new search
    if (isLoading) {
        errorBanner.hidden = true;
    }
    
    loadingSpinner.hidden = !isLoading;
}
});