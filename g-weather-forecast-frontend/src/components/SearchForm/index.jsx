import styles from "./styles.module.scss";
import {useEffect, useRef, useState} from "react";
import PropTypes from "prop-types";
import axios from "axios";

const SearchForm = ({onSearch, onCurrentLocation, errorMessage, setErrorMessage}) => {
    const [cityInput, setCityInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const debouncedSearchRef = useRef(null);

    useEffect(() => {
        if (!cityInput) {
            setSuggestions([]);
            return;
        }

        if (debouncedSearchRef.current) {
            clearTimeout(debouncedSearchRef.current);
        }

        debouncedSearchRef.current = setTimeout(async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_BASEURL}/api/weather/search?q=${cityInput}`
                );
                setSuggestions(response.data);
            } catch (e) {
                console.error("Failed to fetch suggestions:", e);
            }
        }, 300);
    }, [cityInput]);

    const handleCitySelect = async (city) => {
        const coords = `${city.lat},${city.lon}`;
        const error = await onSearch(coords, 5);
        if (!error) {
            setCityInput("");
            setSuggestions([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrorMessage("");
        if (!cityInput.trim()) {
            setErrorMessage("Please enter a city name.");
            return;
        }

        if (
            suggestions.length === 1 &&
            cityInput.trim().toLowerCase() === `${suggestions[0].name}, ${suggestions[0].country}`.toLowerCase()
        ) {
            handleCitySelect(suggestions[0]);
            return;
        }

        setErrorMessage("Please select a city from the list.");
    };

    return (
        <form className={styles.searchForm} onSubmit={handleSubmit}>
            <h1>Enter a city name</h1>
            <div className={styles.cityWrapper}>
                <input
                    type="text"
                    value={cityInput}
                    onChange={(e) => {
                        setCityInput(e.target.value);
                        setSuggestions([]); // clear on typing
                    }}
                    placeholder="E.g., New York, London, Tokyo"
                />
                {suggestions.length > 0 && (
                    <ul className={styles.suggestions}>
                        {suggestions.map((city) => (
                            <li key={city.id} onClick={() => handleCitySelect(city)}>
                                {city.name}, {city.region && `${city.region}, `}{city.country}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {errorMessage && <p>{errorMessage}</p>}
            <button type="submit" className={styles.searchLocation}>Search</button>

            <div className={styles.separator}>or</div>

            <button type="button" onClick={onCurrentLocation} className={styles.currentLocation}>
                Use Current Location
            </button>
        </form>
    );
};

SearchForm.propTypes = {
    onSearch: PropTypes.func.isRequired,
    onCurrentLocation: PropTypes.func.isRequired,
    errorMessage: PropTypes.string.isRequired,
    setErrorMessage: PropTypes.func.isRequired,
};

export default SearchForm;
