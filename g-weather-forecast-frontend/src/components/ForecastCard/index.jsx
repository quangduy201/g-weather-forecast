import styles from './styles.module.scss';
import PropTypes from 'prop-types';

const ForecastCard = ({ forecast }) => {
    return (
        <div className={styles.forecastCard}>
            <h2>{forecast.date}</h2>
            <img src={`https:${forecast.day.condition.icon}`} alt={forecast.day.condition.text}/>
            {/*<p>{forecast.day.condition.text}</p>*/}
            <p>Temp: {forecast.day.avgtemp_c}°C</p>
            <p>Wind: {Math.round(forecast.day.maxwind_kph / 3.6 * 100) / 100} m/s</p>
            <p>Humidity: {forecast.day.avghumidity}%</p>
        </div>
    );
};

ForecastCard.propTypes = {
    forecast: PropTypes.shape({
        date: PropTypes.string.isRequired,
        day: PropTypes.shape({
            condition: PropTypes.shape({
                text: PropTypes.string.isRequired,
                icon: PropTypes.string.isRequired,
            }).isRequired,
            avgtemp_c: PropTypes.number.isRequired,
            maxwind_kph: PropTypes.number.isRequired,
            avghumidity: PropTypes.number.isRequired,
        }).isRequired,
    }).isRequired
};

export default ForecastCard;
