import { useEffect, useState } from 'react';
import axios from 'axios';

const History = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASEURL}/api/weather/history`);
                setHistory(response.data);
            } catch (error) {
                console.error('Error fetching weather history:', error);
            }
        };

        fetchHistory();
    }, []);

    return (
        <div>
            <h1>Weather History</h1>
            <ul>
                {history.map((entry, index) => (
                    <li key={index}>
                        {entry.date} - {entry.weather}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default History;