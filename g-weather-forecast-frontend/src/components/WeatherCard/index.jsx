import styles from "./styles.module.scss";
import PropTypes from "prop-types";

const WeatherCard = ({ location, weather }) => {
    return (
        <div className={styles.weatherCard}>
            <div className={styles.cardContent}>
                <h2>{`${location} (${weather.last_updated})`}</h2>
                <p>Temperature: {weather.temp_c}°C</p>
                <p>Wind: {Math.round(weather.wind_kph / 3.6 * 100) / 100} m/s</p>
                <p>Humidity: {weather.humidity}%</p>
            </div>
            <div className={styles.cardCondition}>
                <img src={`https:${weather.condition.icon}`} alt={weather.condition.text} width={100}/>
                <p>{weather.condition.text}</p>
            </div>
        </div>
    );
};

WeatherCard.propTypes = {
    location: PropTypes.string.isRequired,
    weather: PropTypes.shape({
        last_updated: PropTypes.string.isRequired,
        condition: PropTypes.shape({
            text: PropTypes.string.isRequired,
            icon: PropTypes.string.isRequired,
        }).isRequired,
        temp_c: PropTypes.number.isRequired,
        wind_kph: PropTypes.number.isRequired,
        humidity: PropTypes.number.isRequired,
    }).isRequired,
};

export default WeatherCard;
