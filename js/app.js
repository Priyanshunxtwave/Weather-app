document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const clearSearchBtn = document.getElementById('clear-search-btn');
    const loadingSpinner = document.getElementById('loading-spinner');
    const errorBanner = document.getElementById('error-banner');

    searchInput.addEventListener('input', () => {
        clearSearchBtn.hidden = searchInput.value.trim() === '';
    });

    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearSearchBtn.hidden = true;
        errorBanner.hidden = true;
        searchInput.focus();
    });

    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (!query) return;

        errorBanner.hidden = true;
        loadingSpinner.hidden = false;

        try {
            const locationData = await OpenMeteoAPI.fetchCoordinates(query);
            const weatherData = await OpenMeteoAPI.fetchWeatherData(locationData.latitude, locationData.longitude);
            
            // --- MILESTONE 3 HANDOFF ---
            // Direct the payload arrays directly into our fresh presentation viewer layer
            UI.renderCurrentWeather(locationData, weatherData);
            
        } catch (error) {
            console.error('Execution Chain Exception:', error.message);
            errorBanner.textContent = error.message;
            errorBanner.hidden = false;
        } finally {
            loadingSpinner.hidden = true;
        }
    });
});