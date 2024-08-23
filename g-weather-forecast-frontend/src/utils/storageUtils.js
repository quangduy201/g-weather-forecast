// Get recent searches from localStorage
export const getRecentSearchesFromLocalStorage = () => {
    const savedDate = localStorage.getItem('savedDate');
    const currentDate = new Date().toDateString();

    // Check if the saved date is different from the current date
    if (savedDate !== currentDate) {
        // If different, clear the searches and save the new date
        clearLocalStorage();
        localStorage.setItem('savedDate', currentDate);
        return [];
    }

    const searches = localStorage.getItem('recentSearches');
    return searches ? JSON.parse(searches) : [];
};

// Save a search result to localStorage
export const saveSearchResultToLocalStorage = (result) => {
    const currentDate = new Date().toDateString();
    const searches = getRecentSearchesFromLocalStorage();
    const newSearches = [result, ...searches]
    localStorage.setItem('recentSearches', JSON.stringify(newSearches));
    localStorage.setItem('savedDate', currentDate); // Update the saved date
};

// Remove a search result from localStorage
export const removeSearchResultFromLocalStorage = (index) => {
    const searches = getRecentSearchesFromLocalStorage();
    searches.splice(index, 1); // Remove item at index
    localStorage.setItem('recentSearches', JSON.stringify(searches));
};

// Clear localStorage
export const clearLocalStorage = () => {
    localStorage.removeItem('recentSearches');
};
