/**
 * Utility transformations, date formatting handlers, and WMO weather code dictionary.
 */
const WeatherUtils = {
    /**
     * Map WMO Weather Codes to Human Text and consistent SVG Icon sets
     */
    getCondition(code) {
        const mappings = {
            0: { text: "Clear Sky", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path></svg>` },
            1: { text: "Mainly Clear", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v2M4.93 4.93l1.41 1.41M2 12h2M6.34 17.66l-1.41 1.41"/><path d="M12 12a4 4 0 0 0-4-4c-1.5 0-3 .8-3.6 2.1A5 5 0 0 0 8 18h8a4 4 0 0 0 .5-7.9c-.6-1.2-2-2.1-3.5-2.1A4 4 0 0 0 12 12Z"/></svg>` },
            2: { text: "Partly Cloudy", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v2M4.93 4.93l1.41 1.41M2 12h2M6.34 17.66l-1.41 1.41"/><path d="M12 12a4 4 0 0 0-4-4c-1.5 0-3 .8-3.6 2.1A5 5 0 0 0 8 18h8a4 4 0 0 0 .5-7.9c-.6-1.2-2-2.1-3.5-2.1A4 4 0 0 0 12 12Z"/></svg>` },
            3: { text: "Overcast", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 10a4 4 0 0 0-4-4c-1.5 0-3 .8-3.6 2.1A5 5 0 0 0 8 16h10a4 4 0 0 0 .5-7.9C17.9 6.9 16.5 6 15 6a4 4 0 0 0-3 4Z"/></svg>` },
            45: { text: "Foggy", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M3 16h18M7 8h10M9 20h6"/></svg>` },
            48: { text: "Depositing Rime Fog", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M3 16h18M7 8h10M9 20h6"/></svg>` },
            51: { text: "Light Drizzle", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>` },
            61: { text: "Light Rain", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 13a4 4 0 0 1-8 0c0-1.5 1-2.5 2-3.5l2-2 2 2c1 1 2 2 2 3.5z"/><path d="M12 2v3M5 12h1M19 12h1"/></svg>` },
            63: { text: "Moderate Rain", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 14a4 4 0 0 1-8 0c0-1.5 1-2.5 2-3.5l2-2 2 2c1 1 2 2 2 3.5z"/><path d="M8 20v2M12 20v2M16 20v2"/></svg>` },
            65: { text: "Heavy Rain", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 14a4 4 0 0 1-8 0c0-1.5 1-2.5 2-3.5l2-2 2 2c1 1 2 2 2 3.5z"/><path d="M8 18v4M12 18v4M16 18v4"/></svg>` },
            71: { text: "Light Snow", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5L7 19M19 17L5 7"/></svg>` },
            95: { text: "Thunderstorm", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 11a5 5 0 0 0-4-8 4 4 0 0 0-3 1 4 4 0 0 0-4 3 5 5 0 0 0 1 10h12a4 4 0 0 0 2-7.7z"/><path d="m13 12-3 5h4l-2 5"/></svg>` }
        };
        // Fallback for codes not explicitly assigned above
        return mappings[code] || { text: "Meteo Conditions", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20"/></svg>` };
    },

    /**
     * Pick a CSS layout theme classification class dependent on current celsius reading parameters
     */
    getTemperatureClass(temp) {
        if (temp < 15) return 'temp-cold';
        if (temp > 28) return 'temp-hot';
        return 'temp-neutral';
    },

    /**
     * Compute and output clear human dates
     */
    formatCurrentDate() {
        return new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
};