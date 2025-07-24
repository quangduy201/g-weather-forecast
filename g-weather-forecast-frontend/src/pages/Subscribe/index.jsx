import styles from "./styles.module.scss";
import {useEffect, useRef, useState} from "react";
import {useForm} from "react-hook-form";
import axios from "axios";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useLoading} from "../../contexts/LoadingContext.jsx";

const subscribeSchema = z.object({
    email: z.email("Invalid email address"),
    location: z.string().trim().nonempty("Please select a city from the list"),
    notificationTime: z.string().trim().regex(/^\d{2}:\d{2}$/, "Invalid time format (hh:mm)"),
});

const Subscribe = () => {
    const {showLoading, hideLoading} = useLoading();
    const [suggestions, setSuggestions] = useState([]);
    const [search, setSearch] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const {
        register,
        handleSubmit,
        setValue,
        formState: {errors},
    } = useForm({
        resolver: zodResolver(subscribeSchema),
        defaultValues: {
            email: "",
            location: "",
            notificationTime: "07:00",
        },
    });

    useEffect(() => {
        showLoading();
        getCurrentLocation();
        hideLoading();
    }, [])

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const coords = `${position.coords.latitude},${position.coords.longitude}`;
                    try {
                        const response = await axios.get(
                            `${import.meta.env.VITE_BACKEND_BASEURL}/api/weather/search?q=${coords}`
                        );
                        const location = response.data[0];
                        setSearch(`${location.name}, ${location.country}`);
                        setValue("location", coords, {shouldValidate: true});
                    } catch (e) {
                        console.error("Failed to fetch current location:", e);
                    }
                },
            );
        }
    };

    const debouncedSearchRef = useRef(null);

    useEffect(() => {
        if (!search) {
            setSuggestions([]);
            return;
        }

        if (debouncedSearchRef.current) clearTimeout(debouncedSearchRef.current);

        debouncedSearchRef.current = setTimeout(async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_BASEURL}/api/weather/search?q=${search}`
                );
                setSuggestions(response.data);
            } catch (e) {
                console.error("Failed to fetch suggestions:", e);
            }
        }, 300);
    }, [search]);

    const handleCitySelect = (city) => {
        setValue("location", `${city.lat},${city.lon}`, {shouldValidate: true});
        setSearch(`${city.name}, ${city.country}`);
        setSuggestions([]);
    };

    const submitForm = async (data) => {
        setErrorMessage("");
        setSuccessMessage("");

        const controller = showLoading();
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_BASEURL}/api/subscription/register`,
                data,
                {signal: controller.signal}
            );
            setSuccessMessage(response.data);
        } catch (error) {
            if (!error.response) return;
            if (error.response.status === 400) {
                setErrorMessage("Invalid city or data.");
            } else {
                setErrorMessage("Server error. Please try again later.");
            }
        } finally {
            hideLoading();
        }
    };

    return (
        <div className={styles.subscribe}>
            <h1>Subscribe to Daily Weather Updates</h1>
            <form onSubmit={handleSubmit(submitForm)} className={styles.subscribeForm}>
                <label htmlFor="email">Email:</label>
                <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...register("email")}
                />
                {errors.email && <p className={styles.error}>{errors.email.message}</p>}

                <label htmlFor="city">City:</label>
                <div className={styles.cityWrapper}>
                    <input
                        id="city"
                        type="text"
                        placeholder="Enter city name"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setValue("location", ""); // Reset location value
                        }}
                    />
                    {suggestions.length > 0 && !(suggestions.length === 1 && search === `${suggestions[0].name}, ${suggestions[0].country}`) && (
                        <ul className={styles.suggestions}>
                            {suggestions.map((city) => (
                                <li key={city.id} onClick={() => handleCitySelect(city)}>
                                    {city.name}, {city.region && city.region + ", "} {city.country}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {errors.location && <p className={styles.error}>{errors.location.message}</p>}

                <input type="hidden" {...register("location")} />

                <label htmlFor="notificationTime">Notification Time:</label>
                <input
                    id="notificationTime"
                    type="time"
                    {...register("notificationTime")}
                />
                {errors.notificationTime && (
                    <p className={styles.error}>{errors.notificationTime.message}</p>
                )}

                {errorMessage && <p className={styles.error}>{errorMessage}</p>}
                {successMessage && <p className={styles.success}>{successMessage}</p>}

                <button type="submit">Subscribe</button>
            </form>
        </div>
    );
};

export default Subscribe;
