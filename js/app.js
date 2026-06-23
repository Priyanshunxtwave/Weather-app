document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const clearSearchBtn = document.getElementById('clear-search-btn');
    const loadingSpinner = document.getElementById('loading-spinner');
    const errorBanner = document.getElementById('error-banner');

    // Display inline clear action conditionally depending on input state
    searchInput.addEventListener('input', () => {
        clearSearchBtn.hidden = searchInput.value.trim() === '';
    });

    // Clear search button interaction clear sequence
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearSearchBtn.hidden = true;
        errorBanner.hidden = true;
        searchInput.focus();
    });

    // Main Form submit processing interception point
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (!query) return;

        // Reset system states ahead of network execution chain
        errorBanner.hidden = true;
        loadingSpinner.hidden = false;

        try {
            // Execute Step 1: Geocoding Location resolution
            const locationData = await OpenMeteoAPI.fetchCoordinates(query);
            
            // Execute Step 2: Fetch full forecast packet from parameters
            const weatherData = await OpenMeteoAPI.fetchWeatherData(locationData.latitude, locationData.longitude);
            
            // Console Deliverable validation check 
            console.log('--- MILESTONE 2 DELIVERABLE SUCCESS ---');
            console.log('Target Location Record:', locationData);
            console.log('Resolved Comprehensive Weather Payload:', weatherData);
            
        } catch (error) {
            // Error routing system 
            console.error('Execution Chain Exception:', error.message);
            errorBanner.textContent = error.message;
            errorBanner.hidden = false;
        } finally {
            // Final system shutdown adjustments
            loadingSpinner.hidden = true;
        }
    });
});