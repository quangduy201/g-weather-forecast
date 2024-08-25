import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const SubscriptionConfirm = () => {
    const location = useLocation();
    const [statusMessage, setStatusMessage] = useState("Confirming your subscription...");
    const [statusClass, setStatusClass] = useState("");

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');

        if (token) {
            axios.get(`${import.meta.env.VITE_BACKEND_BASEURL}/api/subscription/confirm-subscription`, {
                params: { token }
            })
                .then(() => {
                    setStatusClass(styles.success);
                    setStatusMessage("Subscription confirmed! You will receive daily weather updates.");
                })
                .catch(() => {
                    setStatusClass(styles.error);
                    setStatusMessage("Invalid token or already confirmed.");
                });
        } else {
            setStatusClass(styles.error);
            setStatusMessage("Invalid or missing token.");
        }
    }, [location.search]);

    return (
        <div className={styles.subscriptionConfirm}>
            <div className={`${styles.confirmationBox} ${statusClass}`}>
                <h1>{statusMessage}</h1>
            </div>
        </div>
    );
};

export default SubscriptionConfirm;
