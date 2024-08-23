import styles from "./styles.module.scss";
import { useState, useEffect } from "react";
import { getRecentSearchesFromLocalStorage, removeSearchResultFromLocalStorage } from "../../utils/storageUtils";
import WeatherCard from "../../components/WeatherCard";
import ForecastCard from "../../components/ForecastCard";

const History = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [selectedResult, setSelectedResult] = useState(null);

    useEffect(() => {
        // Load results from localStorage when component mounts
        setSearchResults(getRecentSearchesFromLocalStorage());
    }, []);

    const handleSelectResult = (index) => {
        setSelectedResult(searchResults[index]);
    };

    const handleRemoveResult = (index) => {
        removeSearchResultFromLocalStorage(index);
        setSearchResults(getRecentSearchesFromLocalStorage()); // Refresh the list
    };

    return (
        <div className={styles.history}>
            <div className={styles.left}>
                <h2>Search History</h2>
                <ul>
                    {searchResults.map((result, index) => (
                        <li key={index} onClick={() => handleSelectResult(index)}>
                            <div className={styles.searchResult}>
                                <span>{result.location.name}</span>
                                <span>{result.currentTime}</span>
                                <button onClick={() => handleRemoveResult(index)}>Remove</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className={styles.right}>
                {selectedResult && (
                    <>
                        <WeatherCard location={selectedResult.location.name} weather={selectedResult.current} />
                        <div className={styles.forecastTitle}>
                            <label>{selectedResult.forecast.forecastday.length}-Day Forecast</label>
                        </div>
                        <div className={styles.forecastSection}>
                            {selectedResult.forecast.forecastday.map((day, index) => (
                                <ForecastCard key={index} forecast={day} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default History;