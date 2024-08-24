import styles from "./styles.module.scss";
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const SubscriptionConfirm = () => {
    const location = useLocation();
    const [statusMessage, setStatusMessage] = useState('Confirming your subscription...');
    const [statusClass, setStatusClass] = useState('');

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');

        if (token) {
            fetch(`${import.meta.env.VITE_BACKEND_BASEURL}/api/subscription/confirm-subscription?token=${token}`)
                .then(response => {
                    if (response.ok) {
                        setStatusClass(styles.success);
                        setStatusMessage('Subscription confirmed! You will receive daily weather updates.');
                    } else {
                        setStatusClass(styles.error);
                        setStatusMessage('Invalid token or already confirmed.');
                    }
                })
                .catch(() => {
                    setStatusClass(styles.error);
                    setStatusMessage('An error occurred while confirming your subscription.');
                });
        } else {
            setStatusClass(styles.error);
            setStatusMessage('Invalid or missing token.');
        }
    }, [location.search]);

    return (
        <div className={styles['subscription-confirm']}>
            <div className={`${styles['confirmation-box']} ${statusClass}`}>
                <h1>{statusMessage}</h1>
            </div>
        </div>
    );
};

export default SubscriptionConfirm;
