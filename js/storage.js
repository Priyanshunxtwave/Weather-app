/**
 * LocalStorage management abstraction layer.
 */
const StorageManager = {
    STORAGE_KEY: 'weather_app_saved_location',

    /**
     * Save successful location coordinate payload
     */
    saveLocation(locationData) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(locationData));
        } catch (e) {
            console.error('Failed to write to localStorage:', e);
        }
    },

    /**
     * Retrieve the stored location payload object
     */
    getSavedLocation() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        try {
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Failed to parse stored location data:', e);
            return null;
        }
    },

    /**
     * Delete persistent location record to reset app state
     */
    clearLocation() {
        localStorage.removeItem(this.STORAGE_KEY);
    }
};