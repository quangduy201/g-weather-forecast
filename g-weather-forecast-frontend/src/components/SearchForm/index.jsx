import styles from "./styles.module.scss";
import { useState } from "react";
import PropTypes from "prop-types";

const SearchForm = ({ onSearch, onCurrentLocation }) => {
    const [cityName, setCityName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        setErrorMessage("");
        if (cityName.trim() === "") {
            return;
        }
        const error = await onSearch(cityName, 5);
        if (!error) {
            setCityName("");
            return;
        }
        setErrorMessage(error);
    };

    const handleCurrentLocation = () => {
        const error = onCurrentLocation();
        if (error) {
            setErrorMessage(error);
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
            <button onClick={handleCurrentLocation} className={styles.currentLocation}>Use Current Location</button>
        </form>
    );
};

SearchForm.propTypes = {
    onSearch: PropTypes.func.isRequired,
    onCurrentLocation: PropTypes.func.isRequired,
};

export default SearchForm;
