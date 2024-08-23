// Get the current date as a string in YYYY-MM-DD format
export const getCurrentDateString = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
};

// Save search data to localStorage
export const saveSearchToLocalStorage = (weatherData) => {
    const currentDateString = getCurrentDateString();
    const searches = JSON.parse(localStorage.getItem('recentSearches')) || {};

    // Clear out any old searches if the date has changed
    if (searches.date !== currentDateString) {
        localStorage.removeItem('recentSearches');
    }

    // Save the new search
    searches.date = currentDateString;
    searches.data = searches.data || [];
    searches.data.push(weatherData);

    localStorage.setItem('recentSearches', JSON.stringify(searches));
};

// Retrieve stored searches from localStorage
export const getStoredSearches = () => {
    const searches = JSON.parse(localStorage.getItem('recentSearches'));
    if (!searches || searches.date !== getCurrentDateString()) {
        localStorage.removeItem('recentSearches');
        return []; // Return an empty array if no searches or the date has changed
    }
    return searches.data;
};
