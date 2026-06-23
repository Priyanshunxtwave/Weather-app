/**
 * Core Network Interface layer abstraction for Open-Meteo APIs.
 */
const OpenMeteoAPI = {
    GEO_BASE_URL: 'https://geocoding-api.open-meteo.com/v1/search',
    WEATHER_BASE_URL: 'https://api.open-meteo.com/v1/forecast',

    /**
     * Step 1: Resolve plain text city string into exact geographical coordinates
     */
    /**
     * Search and retrieve an array of matching city locations matching a partial search term
     */
    async fetchCitySuggestions(query) {
        if (!query || query.length < 2) return [];
        
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to resolve suggestions.');
            const data = await response.json();
            return data.results || [];
        } catch (error) {
            console.error('Suggestions Fetch Error:', error);
            return [];
        }
    },
    async fetchCoordinates(cityName) {
        const url = `${this.GEO_BASE_URL}?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network failure communicating with location discovery engine.');
        
        const data = await response.json();
        if (!data.results || data.results.length === 0) {
            throw new Error(`Could not locate "${cityName}". Check the spelling and try again.`);
        }
        
        return data.results[0]; // Returns { name, latitude, longitude, country, etc. }
    },

    /**
     * Step 2: Extract real-time readings, historical conditions, and forecasts using coordinates
     */
    async fetchWeatherData(lat, lon) {
        // Gathering configurations targeting features needed across Milestones 3 & 4
        const params = [
            `latitude=${lat}`,
            `longitude=${lon}`,
            'current=temperature_2m,relative_humidity_2m,weather_code,pressure_msl,wind_speed_10m',
            'hourly=temperature_2m,weather_code',
            'daily=weather_code,temperature_2m_max,temperature_2m_min',
            'timezone=auto'
        ].join('&');

        const url = `${this.WEATHER_BASE_URL}?${params}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to download up-to-date meteorological records.');
        
        return await response.json();
    }
};