// Get recent searches from localStorage
export const getRecentSearchesFromLocalStorage = () => {
    const searches = localStorage.getItem('recentSearches');
    return searches ? JSON.parse(searches) : [];
};

// Save a search result to localStorage
export const saveSearchResultToLocalStorage = (result) => {
    const searches = getRecentSearchesFromLocalStorage();
    const newSearches = [result, ...searches]
    localStorage.setItem('recentSearches', JSON.stringify(newSearches));
};

// Remove a search result from localStorage
export const removeSearchResultFromLocalStorage = (index) => {
    const searches = getRecentSearchesFromLocalStorage();
    searches.splice(index, 1); // Remove item at index
    localStorage.setItem('recentSearches', JSON.stringify(searches));
};
