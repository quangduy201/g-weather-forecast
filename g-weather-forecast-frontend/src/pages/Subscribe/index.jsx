import styles from "./styles.module.scss";
import {useEffect, useState} from "react";
import axios from "axios";

const Subscribe = () => {
    const [email, setEmail] = useState("");
    const [location, setLocation] = useState("");
    const [cityName, setCityName] = useState("");
    const [currentPosition, setCurrentPosition] = useState(null);
    const [locationBlocked, setLocationBlocked] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    
    useEffect(() => {
        if (location) {
            register(location).then(r => {});
        }
    }, [location]);

    const register = async (location) => {
        console.log(location);
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_BASEURL}/api/subscription/register`, { email: email, location: location});
            setSuccessMessage(response.data);
            setErrorMessage(""); // Clear any previous errors
        } catch (error) {
            console.error('Error fetching weather data:', error);
            if (error.response.status === 400) {
                setErrorMessage("No location found.");
            } else {
                setErrorMessage("The server is not working. Please try again later.");
            }
        }

    }

    const handleCurrentPosition = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coordinates = `${position.coords.latitude},${position.coords.longitude}`;
                    setCurrentPosition(coordinates);
                    setLocation(coordinates);
                    setLocationBlocked(false);
                    console.log(location);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setErrorMessage("Current location is blocked, please unblock it or enter your city name.");
                    setCurrentPosition("");
                    setLocation(cityName);
                    setLocationBlocked(true);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
            setCurrentPosition("");
            setLocationBlocked(true);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (!currentPosition) {
            if (locationBlocked) {
                await register(cityName);
            } else {
                handleCurrentPosition();
            }
        }
    };

    return (
        <div className={styles.subscribe}>
            <h1>Subscribe to Daily Weather Updates</h1>
            <form onSubmit={handleSubmit} className={styles.subscribeForm}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                />
                {locationBlocked && (
                    <input
                        type="text"
                        value={cityName}
                        onChange={(e) => setCityName(e.target.value)}
                        placeholder="Enter your city name"
                        required
                    />
                )}
                {errorMessage && <p className={styles.error}>{errorMessage}</p>}
                {successMessage && <p className={styles.success}>{successMessage}</p>}
                <button onSubmit={handleSubmit}>
                    Subscribe
                </button>
            </form>
        </div>
    );
};

export default Subscribe;
