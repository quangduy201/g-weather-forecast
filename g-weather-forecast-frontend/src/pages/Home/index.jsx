import styles from "./styles.module.scss";
import {useEffect, useState} from "react";
import axios from "axios";
import SearchForm from "../../components/SearchForm";
import WeatherCard from "../../components/WeatherCard";
import ForecastCard from "../../components/ForecastCard";
import {saveSearchResultToLocalStorage, removeSearchResultFromLocalStorage} from "../../utils/storageUtils.js";

const Home = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [cityName, setCityName] = useState("");
    const [numDays, setNumDays] = useState(0);
    const [currentPosition, setCurrentPosition] = useState(null);

    const MIN_FORECAST_DAYS = 5;
    const MAX_FORECAST_DAYS = 14;

    useEffect(() => {
        if (currentPosition) {
            const { latitude, longitude } = currentPosition;
            handleSearch(`${latitude},${longitude}`, MIN_FORECAST_DAYS).then(() => {});
        }
    }, [currentPosition]);

    const handleSearch = async (location, days) => {
        try {
            // Fetch forecast which includes current weather
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASEURL}/api/weather/forecast?location=${location}&days=${days}`);

            setCityName(response.data.location.name);
            setWeather(response.data.current);

            const forecastDays = response.data.forecast.forecastday;
            forecastDays.shift(); // Remove first day (current day)
            setForecast(forecastDays);
            setNumDays(forecastDays.length);

            setErrorMessage(""); // Clear any previous errors

            if (forecastDays.length === MAX_FORECAST_DAYS - 1) {
                removeSearchResultFromLocalStorage(0); // Remove the previous result at the beginning of localStorage
            }
            saveSearchResultToLocalStorage({ ...response.data, currentTime: new Date().toLocaleTimeString() });
        } catch (error) {
            console.error('Error fetching weather data:', error);
            if (error.response.status === 400) {
                setErrorMessage("No location found.");
            } else {
                setErrorMessage("The server is not working. Please try again later.");
            }
        }
    };

    const handleCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentPosition({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                    console.log(position);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    setErrorMessage("Can't access to your location because it has been blocked.");
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
            setErrorMessage("Geolocation is not supported by this browser.");
        }
    };

    return (
        <div className={styles.home}>
            <div className={styles.content}>
                <div className={styles.left}>
                    <SearchForm
                        onSearch={handleSearch}
                        onCurrentLocation={handleCurrentLocation}
                        errorMessage={errorMessage}
                        setErrorMessage={setErrorMessage}
                    />
                </div>

                <div className={styles.right}>
                    {weather && <WeatherCard location={cityName} weather={weather}/>}

                    <div className={styles.forecastTitle}>
                        {numDays > 0 && <label>{numDays}-Day Forecast</label>}
                    </div>

                    <div className={styles.forecastSection}>
                        {forecast.length > 0 && forecast.map((day, index) => (
                            <ForecastCard key={index} forecast={day}/>
                        ))}
                    </div>

                    {forecast.length === MIN_FORECAST_DAYS - 1 && (
                        <button onClick={() => handleSearch(cityName, MAX_FORECAST_DAYS)} className={styles.loadMore}>
                            Load more
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
