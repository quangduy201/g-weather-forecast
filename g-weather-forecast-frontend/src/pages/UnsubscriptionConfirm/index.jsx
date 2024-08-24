import styles from './styles.module.scss';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const UnsubscribeConfirm = () => {
    const location = useLocation();
    const [statusMessage, setStatusMessage] = useState('Processing your unsubscription...');
    const [statusClass, setStatusClass] = useState('');

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');

        if (token) {
            fetch(`${import.meta.env.VITE_BACKEND_BASEURL}/api/subscription/confirm-unsubscription?token=${token}`)
                .then(response => {
                    if (response.ok) {
                        setStatusClass(styles.success);
                        setStatusMessage('Unsubscription confirmed! You will no longer receive daily weather updates.');
                    } else {
                        setStatusClass(styles.error);
                        setStatusMessage('Invalid token or already unsubscribed.');
                    }
                })
                .catch(() => {
                    setStatusClass(styles.error);
                    setStatusMessage('An error occurred while processing your unsubscription.');
                });
        } else {
            setStatusClass(styles.error);
            setStatusMessage('Invalid or missing token.');
        }
    }, [location.search]);

    return (
        <div className={styles['unsubscribe-confirm']}>
            <div className={`${styles['confirmation-box']} ${statusClass}`}>
                <h1>{statusMessage}</h1>
            </div>
        </div>
    );
};

export default UnsubscribeConfirm;
