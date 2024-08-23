import styles from "./styles.module.scss";
import { useState } from "react";
import PropTypes from "prop-types";

const SearchForm = ({ onSearch, onCurrentLocation, errorMessage, setErrorMessage }) => {
    const [cityName, setCityName] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        setErrorMessage("");
        if (cityName.trim() === "") {
            setErrorMessage("Please enter a city name.");
            return;
        }
        const error = await onSearch(cityName, 5);
        if (!error) {
            setCityName("");
        }
    };

    return (
        <form className={styles.searchForm} onSubmit={handleSubmit}>
            <h1>Enter a city name</h1>
            <input
                type="text"
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                placeholder="E.g., New York, London, Tokyo"
            />
            <p>{errorMessage}</p>
            <button type="submit" className={styles.searchLocation}>Search</button>
            <div className={styles.separator}>
                or
            </div>
            <button type="button" onClick={onCurrentLocation} className={styles.currentLocation}>Use Current Location</button>
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
