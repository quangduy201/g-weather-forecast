import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLoading } from "../../contexts/LoadingContext.jsx";

const Subscribe = () => {
    const [email, setEmail] = useState("");
    const [location, setLocation] = useState("");
    const [cityName, setCityName] = useState("");
    const [currentPosition, setCurrentPosition] = useState(null);
    const [locationBlocked, setLocationBlocked] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const { showLoading, hideLoading } = useLoading();

    useEffect(() => {
        if (location) {
            register(location).then(() => {});
        }
    }, [location]);

    const register = async (location) => {
        try {
            const controller = showLoading();

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_BASEURL}/api/subscription/register`, { email: email, location: location}, {
                signal: controller.signal,
            });
            setSuccessMessage(response.data);
            setErrorMessage(""); // Clear any previous errors
        } catch (error) {
            if (!error.response) { // API was canceled and haven't gotten the response
                return;
            }
            if (error.response.status === 400) {
                setErrorMessage("No location found.");
            } else {
                setErrorMessage("The server is not working. Please try again later.");
            }
        } finally {
            hideLoading();
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
                },
                (error) => {
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
