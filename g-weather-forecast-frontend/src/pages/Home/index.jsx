import styles from "./styles.module.scss";
import {useEffect, useState} from "react";
import axios from "axios";
import NavBar from "../../components/NavBar";
import SearchForm from "../../components/SearchForm";
import WeatherCard from "../../components/WeatherCard";
import ForecastCard from "../../components/ForecastCard";

const Home = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [result, setResult] = useState(null);
    const [cityName, setCityName] = useState("");
    const [numDays, setNumDays] = useState(0);
    const [currentPosition, setCurrentPosition] = useState(null);
    const [recentSearches, setRecentSearches] = useState([]);

    useEffect(() => {
        if (currentPosition) {
            const { latitude, longitude } = currentPosition;
            handleSearch(`${latitude},${longitude}`, 5).then(() => {});
        }
    }, [currentPosition]);

    const handleSearch = async (location, days) => {
        try {
            // Fetch forecast which includes current weather
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASEURL}/api/weather/forecast?location=${location}&days=${days}`);

            setCityName(response.data.location.name);
            setNumDays(days);
            setResult(response.data);
            setWeather(response.data.current);
            const forecastDays = response.data.forecast.forecastday;
            forecastDays.shift(); // Remove first day
            setForecast(forecastDays);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            if (error.response.status === 400) {
                return "No location found.";
            } else {
                return "The server is not working. Please try again later.";
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
                    return `Can't access to your location because it has been blocked.`;
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
            return `Geolocation is not supported by this browser.`;
        }
    };

    return (
        <div className={styles.home}>
            <NavBar />
            <div className={styles.content}>
                <div className={styles.left}>
                    <SearchForm onSearch={handleSearch} onCurrentLocation={handleCurrentLocation} />
                </div>

                <div className={styles.right}>
                    {weather && <WeatherCard location={cityName} weather={weather}/>}

                    <label>{numDays}-Day Forecast</label>

                    <div className={styles.forecastSection}>
                        {forecast.length > 0 && forecast.map((day, index) => (
                            <ForecastCard key={index} forecast={day}/>
                        ))}
                    </div>

                    {forecast.length === 4 && (
                        <button onClick={() => handleSearch(cityName, 14)} className={styles.loadMore}>
                            Load more
                        </button>
                    )}
                </div>
            </div>

            {<div className={"recent-search"}></div>}
        </div>
    );
};

export default Home;
