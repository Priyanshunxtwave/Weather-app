document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const htmlElement = document.documentElement;

    // SVG graphics definitions for dynamic swapping
    const sunIconHTML = `<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>`;
    const moonIconHTML = `<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>`;

    // 1. Check for stored theme or fallback to user system settings
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

    // 2. Set the theme on initial load
    setTheme(initialTheme);

    // 3. Toggle button click listener
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });

    // Helper function to update DOM and localStorage
    function setTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Dynamically change icon shape inside the button
        if (theme === 'dark') {
            themeIcon.innerHTML = sunIconHTML; // Show sun icon when in dark mode to switch to light
        } else {
            themeIcon.innerHTML = moonIconHTML; // Show moon icon when in light mode to switch to dark
        }
    }
});