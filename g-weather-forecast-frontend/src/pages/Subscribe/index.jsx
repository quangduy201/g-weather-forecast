import { useState } from 'react';
import axios from 'axios';

const Subscribe = () => {
    const [email, setEmail] = useState('');
    const [location, setLocation] = useState('');

    const handleSubscribe = async () => {
        try {
            await axios.post('/api/subscription/register', { email, location });
            alert('Subscription request sent. Please check your email.');
        } catch (error) {
            console.error('Error subscribing:', error);
        }
    };

    return (
        <div>
            <h1>Subscribe to Daily Weather Updates</h1>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
            />
            <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter your location"
            />
            <button onClick={handleSubscribe}>Subscribe</button>
        </div>
    );
};

export default Subscribe;