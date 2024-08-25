import styles from './styles.module.scss';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from "axios";

const UnsubscribeConfirm = () => {
    const location = useLocation();
    const [statusMessage, setStatusMessage] = useState("Processing your unsubscription...");
    const [statusClass, setStatusClass] = useState('');

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');

        if (token) {
            axios.get(`${import.meta.env.VITE_BACKEND_BASEURL}/api/subscription/confirm-unsubscription`, {
                params: { token }
            })
                .then(() => {
                    setStatusClass(styles.success);
                    setStatusMessage("Unsubscription confirmed! You will no longer receive daily weather updates.");
                })
                .catch(() => {
                    setStatusClass(styles.error);
                    setStatusMessage("Invalid token or already unsubscribed.");
                });
        } else {
            setStatusClass(styles.error);
            setStatusMessage("Invalid or missing token.");
        }
    }, [location.search]);

    return (
        <div className={styles.unsubscribeConfirm}>
            <div className={`${styles.confirmationBox} ${statusClass}`}>
                <h1>{statusMessage}</h1>
            </div>
        </div>
    );
};

export default UnsubscribeConfirm;
